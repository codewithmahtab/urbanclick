import "server-only";
import { prisma } from "@/lib/prisma";

export async function getSellerProductFormData() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),

    prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ]);

  return {
    categories,
    brands,
  };
}
