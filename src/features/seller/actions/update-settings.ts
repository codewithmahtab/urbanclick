"use server";

import { requireSeller } from "@/features/auth/lib/authorization";
import { prisma } from "@/lib/prisma";
import { SellerSettingsSchema, SellerSettingsState } from "@/features/seller/schemas/settings.schema";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function updateSellerSettings(
  _prevState: SellerSettingsState,
  formData: FormData,
): Promise<SellerSettingsState> {
  const seller = await requireSeller();

  const validatedFields = SellerSettingsSchema.safeParse({
    storeName: formData.get("storeName"),
    description: formData.get("description"),
    phone: formData.get("phone"),
    addressLine: formData.get("addressLine"),
    city: formData.get("city"),
    state: formData.get("state"),
    pincode: formData.get("pincode"),
    gstin: formData.get("gstin"),
    pan: formData.get("pan"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);
    return { fieldErrors };
  }

  const { storeName, description, phone, addressLine, city, state, pincode, gstin, pan } =
    validatedFields.data;

  try {
    await prisma.seller.update({
      where: { id: seller.id },
      data: {
        storeName,
        description: description || null,
        phone,
        addressLine,
        city,
        state,
        pincode,
        gstin: gstin || null,
        pan: pan || null,
      },
    });
  } catch (error) {
    console.error("Seller settings update error:", error);
    return { formError: "Something went wrong. Please try again later." };
  }

  revalidatePath("/seller/settings");
  return { success: true };
}
