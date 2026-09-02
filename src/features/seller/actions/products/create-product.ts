"use server";

import { requireSeller } from "@/features/auth/lib/authorization";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/features/seller/schemas/product.schema";
import { generateSKU } from "@/features/products/utils/generate-sku";
import { createProductSlug } from "@/features/products/utils/slug";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { CreateProductState } from "../../types/actions";

export async function createProduct(
  _prevState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> {
  const seller = await requireSeller();

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    brandId: formData.get("brandId"),
    categoryIds: formData.getAll("categoryIds"),
    price: formData.get("price"),
    stock: formData.get("stock"),
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);
    return {
      fieldErrors,
    };
  }

  const { name, description, imageUrl, brandId, categoryIds, price, stock } =
    validatedFields.data;

  const priceInPaise = Math.round(price * 100);
  const sku = generateSKU(name);
  const slug = await createProductSlug(name);

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        priceInPaise,
        stock,
        sku,
        sellerId: seller.id,
        brandId: brandId || null,
        categories: {
          create: categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Failed to create product:", error);
    return {
      formError: "An unexpected error occurred while creating the product.",
    };
  }

  updateTag("products");
  revalidatePath("/seller/products");
  redirect("/seller/products");
}
