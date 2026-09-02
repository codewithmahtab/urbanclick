import "server-only";
import { prisma } from "@/lib/prisma";


export async function getSellerEarnings(sellerId: string) {
  // Get all order items that belong to this seller's products
  // Excluding CANCELLED items from earnings
  const orderItems = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId: sellerId,
      },
      status: {
        not: "CANCELLED",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      order: {
        select: {
          id: true,
        },
      },
    },
  });

  let totalEarningsInPaise = 0;
  let pendingClearanceInPaise = 0;
  let totalItemsSold = 0;

  for (const item of orderItems) {
    const amount = item.priceInPaise * item.quantity;
    totalItemsSold += item.quantity;

    if (item.status === "DELIVERED") {
      totalEarningsInPaise += amount;
    } else {
      // PENDING, PROCESSING, SHIPPED
      pendingClearanceInPaise += amount;
    }
  }

  return {
    totalEarningsInPaise,
    pendingClearanceInPaise,
    totalItemsSold,
    ledger: orderItems,
  };
}

export type SellerLedgerItem = Awaited<ReturnType<typeof getSellerEarnings>>["ledger"][number];
