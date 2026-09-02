import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  const [
    totalUsers,
    totalSellers,
    pendingSellers,
    totalProducts,
    totalOrders,
    revenueResult,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.seller.count(),
    prisma.seller.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalInPaise: true } }),
  ]);

  return {
    totalUsers,
    totalSellers,
    pendingSellers,
    totalProducts,
    totalOrders,
    totalRevenueInPaise: revenueResult._sum.totalInPaise ?? 0,
  };
}
