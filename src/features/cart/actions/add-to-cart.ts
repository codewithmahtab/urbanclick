"use server";

import { getCurrentUser } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

export async function addToCartAction(productId: string, quantity: number) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { success: false, error: "UNAUTHENTICATED" };
  }
  
  const userId = user.id;

  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const cartItem = await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });

  revalidatePath("/");
  revalidatePath("/cart");

  return {
    success: true,
    cartItemId: cartItem.id,
    totalQuantity: cartItem.quantity,
  };
}
