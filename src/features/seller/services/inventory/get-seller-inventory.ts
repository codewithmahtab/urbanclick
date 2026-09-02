import "server-only";
import { prisma } from "@/lib/prisma";

export async function getSellerInventory(sellerId: string) {
  return prisma.product.findMany({
    where: {
      sellerId,
      isDeleted: false,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      sku: true,
      imageUrl: true,
      stock: true,
      isPublished: true,
    },
  });
}

export type SellerInventoryItem = Awaited<
  ReturnType<typeof getSellerInventory>
>[number];
