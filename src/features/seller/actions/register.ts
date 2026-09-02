"use server";

import { requireUser } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import {
  SellerRegisterFormState,
  SellerRegisterSchema,
} from "@/features/seller/schemas/register.schema";
import { redirect } from "next/navigation";
import z from "zod";
import { createSellerSlug } from "@/features/seller/utils/slug";

export async function registerSeller(
  _prevState: SellerRegisterFormState,
  formData: FormData,
) {
  const validatedFields = SellerRegisterSchema.safeParse({
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

    return {
      fieldErrors,
    };
  }

  const {
    storeName,
    description,
    phone,
    addressLine,
    city,
    state,
    pincode,
    gstin,
    pan,
  } = validatedFields.data;

  const user = await requireUser();

  try {
    const existingSeller = await prisma.seller.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (existingSeller) {
      return {
        formError: "You already have a seller account.",
      };
    }

    await prisma.seller.create({
      data: {
        userId: user.id,
        storeName,
        description: description || null,
        phone,
        addressLine,
        city,
        state,
        pincode,
        gstin: gstin || null,
        pan: pan || null,
        slug: await createSellerSlug(storeName),
      },
      select: {
        id: true,
        status: true,
      },
    });
  } catch (error) {
    console.error("Seller registration error:", error);

    return {
      formError: "Something went wrong. Please try again later.",
    };
  }

  redirect("/seller/register");
}
