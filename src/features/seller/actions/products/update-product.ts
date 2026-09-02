"use server";

import { requireSeller } from "@/features/auth/lib/authorization";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/features/seller/schemas/product.schema";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { CreateProductState } from "../../types/actions";

export async function updateProduct(
  productId: string,
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

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.sellerId !== seller.id) {
      return { formError: "Product not found or unauthorized." };
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        imageUrl,
        priceInPaise,
        stock,
        brandId: brandId || null,
        categories: {
          deleteMany: {}, // Clear old associations
          create: categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Failed to update product:", error);
    return {
      formError: "An unexpected error occurred while updating the product.",
    };
  }

  updateTag("products");
  revalidatePath("/seller/products");
  redirect("/seller/products");
}
