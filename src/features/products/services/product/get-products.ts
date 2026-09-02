import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildWhere } from "@/features/products/utils/build-where";
import { ProductQueryFilters } from "@/features/products/types/filters";
import { productCardSelect } from "@/features/products/types/products";
import { cacheLife, cacheTag } from "next/cache";

export const ITEMS_PER_PAGE = 8;

export async function getProducts({
  page = 1,
  searchText,
  category,
  brand,
  minPrice,
  maxPrice,
  sort,
}: ProductQueryFilters = {}) {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `products:search:${searchText || ""}:cat:${category || ""}:brand:${brand || ""}:min:${minPrice || 0}:max:${maxPrice || 0}:sort:${sort || ""}:page:${page}`);
  const productWhere = buildWhere({
    searchText,
    category,
    brand,
    minPrice,
    maxPrice,
  });

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: "desc" }, { id: "desc" }];
  
  if (sort === "price-asc") {
    orderBy = [{ priceInPaise: "asc" }, { id: "desc" }];
  } else if (sort === "price-desc") {
    orderBy = [{ priceInPaise: "desc" }, { id: "desc" }];
  } else if (sort === "rating-desc") {
    orderBy = [{ averageRating: "desc" }, { id: "desc" }];
  }

  return await prisma.product.findMany({
    where: productWhere,
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    orderBy,
    select: productCardSelect,
  });
}

export async function getProductCount({
  searchText,
  category,
  brand,
  minPrice,
  maxPrice,
}: ProductQueryFilters = {}) {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `products:count:search:${searchText || ""}:cat:${category || ""}:brand:${brand || ""}:min:${minPrice || 0}:max:${maxPrice || 0}`);
  const productWhere = buildWhere({
    searchText,
    category,
    brand,
    minPrice,
    maxPrice,
  });
  return await prisma.product.count({
    where: productWhere,
  });
}

export async function getProductFilters({ searchText, category }: ProductQueryFilters = {}) {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `products:filters:search:${searchText || ""}:cat:${category || ""}`);
  const filterProductWhere = buildWhere({ searchText, category });

  return await prisma.product.findMany({
    where: filterProductWhere,

    select: {
      id: true,

      brand: {
        select: {
          slug: true,
          name: true,
        },
      },
      categories: {
        select: {
          category: {
            select: {
              slug: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function getPriceRange({ searchText, category }: ProductQueryFilters) {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `products:pricerange:search:${searchText || ""}:cat:${category || ""}`);
  const priceFilterWhere = buildWhere({ searchText, category });

  return await prisma.product.aggregate({
    where: priceFilterWhere,
    _min: {
      priceInPaise: true,
    },
    _max: {
      priceInPaise: true,
    },
  });
}
