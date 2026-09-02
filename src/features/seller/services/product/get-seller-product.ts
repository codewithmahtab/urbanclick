import "server-only";
import { prisma } from "@/lib/prisma";

export async function getSellerProductBySlug(slug: string, sellerId: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      sellerId,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      isPublished: true,
      brandId: true,

      categories: {
        select: {
          categoryId: true,
        },
      },

      priceInPaise: true,
      stock: true,
      sku: true,
      isActive: true,
    },
  });
}
