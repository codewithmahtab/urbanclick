import "server-only";
import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  return await prisma.category.findMany({
    where: {
      isActive: true,
    },
  });
}

export async function getFeaturedCategoriesWithProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      parentId: null,
    },
    take: 8,
    include: {
      children: {
        include: {
          products: {
            take: 4,
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
      products: {
        take: 4,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  return categories.map((category) => {
    let allProducts = [...category.products];
    for (const child of category.children) {
      allProducts = [...allProducts, ...child.products];
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: allProducts.slice(0, 4),
    };
  });
}

export async function getCategoryBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("categories", `category:${slug}`);
  return await prisma.category.findUnique({
    where: { slug },
  });
}
