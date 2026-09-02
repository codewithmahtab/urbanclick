"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setDefaultAddressAction(addressId: string) {
  const { userId } = await requireSession();

  const address = await prisma.address.findUnique({
    where: { id: addressId },
    select: { userId: true },
  });

  if (!address || address.userId !== userId) {
    return { success: false, error: "Address not found." };
  }

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    }),
    prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    }),
  ]);

  revalidatePath("/addresses");
  return { success: true };
}
