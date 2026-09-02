"use server";

import { getSession } from "@/features/auth/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleWishlistAction(productId: string) {
  const session = await getSession();

  if (!session) {
    return { success: false, unauthorized: true };
  }

  const userId = session.userId;

  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      wishlistId_productId: {
        wishlistId: wishlist.id,
        productId,
      },
    },
  });

  if (existingItem) {
    await prisma.wishlistItem.delete({
      where: {
        id: existingItem.id,
      },
    });
  } else {
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath(`/product/[slug]`, "page");
  revalidatePath("/wishlist");

  return { success: true, isWishlisted: !existingItem };
}
