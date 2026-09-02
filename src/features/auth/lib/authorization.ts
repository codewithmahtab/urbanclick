import "server-only";

import { requireUser } from "./dal";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    notFound();
  }

  return user;
}

export async function requireSeller() {
  const user = await requireUser();

  const seller = await prisma.seller.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      storeName: true,
      status: true,
    },
  });

  if (!seller || seller.status !== "APPROVED") {
    redirect("/seller/register");
  }

  return seller;
}
