import "server-only";
import { prisma } from "@/lib/prisma";

export async function getSellerProfile(sellerId: string) {
  return prisma.seller.findUnique({
    where: { id: sellerId },
    select: {
      storeName: true,
      description: true,
      phone: true,
      addressLine: true,
      city: true,
      state: true,
      pincode: true,
      gstin: true,
      pan: true,
    },
  });
}
