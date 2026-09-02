"use server";

import { prisma } from "@/lib/prisma";

export type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

export async function getRelatedProducts(query: string): Promise<RelatedProduct[]> {
  if (!query || query.trim() === "") return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query.trim(),
          mode: "insensitive",
        },
        isActive: true,
        isPublished: true,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
      },
      take: 5, // Limit to 5 results for dropdown
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}
