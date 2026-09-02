"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AddressSchema, AddressFormState } from "../validations/address";
import z from "zod";

export async function addAddressAction(
  _prevState: AddressFormState,
  formData: FormData,
) {
  const { userId } = await requireSession();

  const validatedFields = AddressSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    addressLine: formData.get("addressLine"),
    city: formData.get("city"),
    state: formData.get("state"),
    pincode: formData.get("pincode"),
    country: formData.get("country") || "India",
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);
    return { fieldErrors };
  }

  const { fullName, phone, addressLine, city, state, pincode, country } =
    validatedFields.data;

  try {
    const existingCount = await prisma.address.count({ where: { userId } });

    await prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
        country,
        isDefault: existingCount === 0,
      },
    });

    revalidatePath("/addresses");
    return { success: true };
  } catch (error) {
    console.error("Add address error:", error);
    return { formError: "Failed to save address. Please try again." };
  }
}
