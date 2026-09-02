import "server-only";
import { prisma } from "@/lib/prisma";
import { subDays, format, eachDayOfInterval } from "date-fns";

export async function getAdminChartData() {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const today = new Date();

  // Get all orders from the last 30 days
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
      totalInPaise: true,
    },
  });

  // Create a map of all days in the last 30 days initialized to 0
  const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
  const revenueMap = new Map<string, number>();
  
  days.forEach((day) => {
    revenueMap.set(format(day, "MMM dd"), 0);
  });

  // Aggregate revenue by day
  orders.forEach((order) => {
    const day = format(new Date(order.createdAt), "MMM dd");
    if (revenueMap.has(day)) {
      revenueMap.set(day, revenueMap.get(day)! + order.totalInPaise);
    }
  });

  // Convert map to array for Recharts
  return Array.from(revenueMap.entries()).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}
