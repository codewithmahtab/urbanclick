"use server";

import { requireAdmin } from "@/features/auth/lib/authorization";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SellerStatus } from "@prisma/client";

export async function updateSellerStatus(
  sellerId: string,
  newStatus: SellerStatus,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    select: { id: true },
  });

  if (!seller) {
    return { success: false, error: "Seller not found." };
  }

  await prisma.seller.update({
    where: { id: sellerId },
    data: { status: newStatus },
  });

  revalidatePath("/admin/sellers");
  revalidatePath("/admin");
  return { success: true };
}
