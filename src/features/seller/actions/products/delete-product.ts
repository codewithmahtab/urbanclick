"use server";

import { requireSeller } from "@/features/auth/lib/authorization";
import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

export async function deleteProduct(productId: string) {
  const seller = await requireSeller();

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { sellerId: true },
    });

    if (!product || product.sellerId !== seller.id) {
      throw new Error("Unauthorized");
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isDeleted: true },
    });

    updateTag("products");
    revalidatePath("/seller/products");
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw new Error("Failed to delete product");
  }
}
