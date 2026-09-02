import "server-only";
import { prisma } from "@/lib/prisma";

export async function getSellerProducts(sellerId: string) {
  return prisma.product.findMany({
    where: {
      sellerId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      isPublished: true,
      createdAt: true,
      priceInPaise: true,
      stock: true,
      sku: true,
    },
  });
}
