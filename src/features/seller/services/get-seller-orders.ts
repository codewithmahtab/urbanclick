import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/features/auth/lib/authorization";

export async function getSellerOrders() {
  const seller = await requireSeller();

  const orderItems = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId: seller.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
      order: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          shippingFullName: true,
          shippingAddressLine: true,
          shippingCity: true,
          shippingState: true,
          shippingPincode: true,
          shippingPhone: true,
        },
      },
    },
  });

  return orderItems;
}
