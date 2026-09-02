"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function removeCartItemAction(cartItemId: string) {
  const { userId } = await requireSession();

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  revalidatePath("/");
  revalidatePath("/cart");

  return { success: true };
}
