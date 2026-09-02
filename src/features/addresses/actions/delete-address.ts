"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAddressAction(addressId: string) {
  const { userId } = await requireSession();

  const address = await prisma.address.findUnique({
    where: { id: addressId },
    select: { userId: true, isDefault: true },
  });

  if (!address || address.userId !== userId) {
    return { success: false, error: "Address not found." };
  }

  await prisma.address.delete({ where: { id: addressId } });

  if (address.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId },
      orderBy: { id: "asc" },
    });
    if (next) {
      await prisma.address.update({
        where: { id: next.id },
        data: { isDefault: true },
      });
    }
  }

  revalidatePath("/addresses");
  return { success: true };
}
