import { getCurrentUser } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";

export async function getCart() {
  const user = await getCurrentUser();
  if (!user) return null;
  return await getCartByUserId(user.id);
}

export async function getCartByUserId(userId: string) {
  return prisma.cart.findUnique({
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
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });
}
