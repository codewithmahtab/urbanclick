import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAllSellers() {
  return prisma.seller.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      storeName: true,
      slug: true,
      phone: true,
      city: true,
      state: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      _count: {
        select: { products: true },
      },
    },
  });
}

export type AdminSellerItem = Awaited<ReturnType<typeof getAllSellers>>[number];
