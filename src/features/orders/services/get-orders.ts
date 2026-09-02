import "server-only";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/features/auth/lib/dal";

export async function getOrders() {
  const user = await requireUser("/orders");

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              slug: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
}

export type OrdersWithItems = Awaited<ReturnType<typeof getOrders>>;
export type SingleOrderWithItems = OrdersWithItems[number];
export type SingleOrderItem = SingleOrderWithItems["items"][number];
