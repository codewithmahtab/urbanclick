import { getCurrentUser } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";

export async function getCartCount() {
  const user = await getCurrentUser();
  if (!user) return 0;
  return await getCartCountByUserId(user.id);
}

export async function getCartCountByUserId(userId: string) {
  const result = await prisma.cartItem.aggregate({
    where: {
      cart: {
        userId,
      },
    },
    _sum: {
      quantity: true,
    },
  });

  return result._sum.quantity || 0;
}
