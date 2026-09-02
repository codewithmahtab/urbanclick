import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAllOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      status: true,
      totalInPaise: true,
      createdAt: true,
      shippingFullName: true,
      shippingCity: true,
      shippingState: true,
      user: {
        select: { email: true, name: true },
      },
      items: {
        select: { quantity: true, productName: true },
      },
    },
  });
}

export type AdminOrderItem = Awaited<ReturnType<typeof getAllOrders>>[number];
