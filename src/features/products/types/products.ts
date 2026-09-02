import { Prisma } from "@prisma/client";

export const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  imageUrl: true,
  averageRating: true,
  totalReviews: true,
  priceInPaise: true,
} satisfies Prisma.ProductSelect;

export const productDetailSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
  averageRating: true,
  totalReviews: true,
  priceInPaise: true,
  stock: true,
  sku: true,
  isActive: true,

  brand: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  seller: {
    select: {
      id: true,
      storeName: true,
    },
  },

  categories: {
    select: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

export type Product = Prisma.ProductGetPayload<Prisma.ProductDefaultArgs>;

export type ProductCardType = Prisma.ProductGetPayload<{
  select: typeof productCardSelect;
}>;

export type ProductDetailType = Prisma.ProductGetPayload<{
  select: typeof productDetailSelect;
}>;
