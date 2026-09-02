import { Prisma } from "@prisma/client";

export function buildWhere({
  searchText,
  category,
  brand,
  minPrice,
  maxPrice,
}: {
  searchText?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    isDeleted: false,
    seller: {
      status: "APPROVED",
    },
  };

  if (searchText) {
    where.OR = [
      {
        name: {
          contains: searchText,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchText,
          mode: "insensitive",
        },
      },
    ];
  }

  if (category) {
    const categories = category.split(",").filter(Boolean);

    where.categories = {
      some: {
        category: {
          OR: [
            { slug: { in: categories } },
            { parent: { slug: { in: categories } } },
          ],
        },
      },
    };
  }

  if (brand) {
    const brands = brand.split(",").filter(Boolean);

    where.brand = {
      slug: {
        in: brands,
      },
    };
  }

  if (minPrice || maxPrice) {
    const min = Number(minPrice);
    const max = Number(maxPrice);

    const parsedMin = Number.isFinite(min) ? min : undefined;
    const parsedMax = Number.isFinite(max) ? max : undefined;

    where.priceInPaise = {
      ...(parsedMin !== undefined && { gte: parsedMin }),
      ...(parsedMax !== undefined && { lte: parsedMax }),
    };
  }

  return where;
}
