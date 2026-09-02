import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";

export async function getWishlist() {
  const { userId } = await requireSession();

  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              priceInPaise: true,
              imageUrl: true,
              slug: true,
              stock: true,
            },
          },
        },
      },
    },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                priceInPaise: true,
                imageUrl: true,
                slug: true,
                stock: true,
              },
            },
          },
        },
      },
    });
  }

  return wishlist;
}
