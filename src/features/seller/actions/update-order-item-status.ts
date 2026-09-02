"use server";

import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/features/auth/lib/authorization";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function updateOrderItemStatus(orderItemId: string, newStatus: OrderStatus) {
  const seller = await requireSeller();

  // Verify the order item belongs to this seller
  const item = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: {
      product: {
        select: { sellerId: true },
      },
    },
  });

  if (!item) {
    return { success: false, error: "Order item not found" };
  }

  if (item.product.sellerId !== seller.id) {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.orderItem.update({
    where: { id: orderItemId },
    data: { status: newStatus },
  });

  revalidatePath("/seller/orders");
  return { success: true };
}
