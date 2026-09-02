"use server";

import { requireSeller } from "@/features/auth/lib/authorization";
import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

export async function updateStock(
  productId: string,
  newStock: number,
): Promise<{ success: boolean; error?: string }> {
  const seller = await requireSeller();

  if (typeof newStock !== "number" || newStock < 0 || !Number.isInteger(newStock)) {
    return { success: false, error: "Stock must be a non-negative whole number." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerId: true },
  });

  if (!product || product.sellerId !== seller.id) {
    return { success: false, error: "Product not found or unauthorized." };
  }

  await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock },
  });

  updateTag("products");
  revalidatePath("/seller/inventory");
  return { success: true };
}
