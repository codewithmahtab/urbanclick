import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });
}

export type AdminUserItem = Awaited<ReturnType<typeof getAllUsers>>[number];
