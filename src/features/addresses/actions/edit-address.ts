"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AddressSchema, AddressFormState } from "../validations/address";
import z from "zod";

export async function editAddressAction(
  _prevState: AddressFormState,
  formData: FormData,
) {
  const { userId } = await requireSession();

  const addressId = formData.get("addressId") as string;
  if (!addressId) return { formError: "Invalid address." };

  const existing = await prisma.address.findUnique({
    where: { id: addressId },
    select: { userId: true },
  });

  if (!existing || existing.userId !== userId) {
    return { formError: "Address not found." };
  }

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

  try {
    await prisma.address.update({
      where: { id: addressId },
      data: validatedFields.data,
    });

    revalidatePath("/addresses");
    return { success: true };
  } catch (error) {
    console.error("Edit address error:", error);
    return { formError: "Failed to update address. Please try again." };
  }
}
