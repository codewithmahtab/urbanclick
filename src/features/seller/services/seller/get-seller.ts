import "server-only";
import { prisma } from "@/lib/prisma";

export async function getSellerApplications() {
  return prisma.seller.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      storeName: true,
      phone: true,
      status: true,
      createdAt: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getSellerById(sellerId: string) {
  return prisma.seller.findUnique({
    where: {
      id: sellerId,
    },
    select: {
      id: true,

      storeName: true,
      description: true,
      phone: true,
      addressLine: true,
      city: true,
      state: true,
      pincode: true,
      country: true,
      gstin: true,
      pan: true,
      status: true,
      createdAt: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
