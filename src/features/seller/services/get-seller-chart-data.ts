import "server-only";
import { prisma } from "@/lib/prisma";
import { subDays, format, eachDayOfInterval } from "date-fns";

export async function getSellerChartData(sellerId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const today = new Date();

  // Get all order items from the last 30 days for this seller
  const orderItems = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId,
      },
      createdAt: {
        gte: thirtyDaysAgo,
      },
      status: {
        not: "CANCELLED", // Exclude cancelled items from revenue chart
      },
    },
    select: {
      createdAt: true,
      priceInPaise: true,
      quantity: true,
    },
  });

  // Create a map of all days in the last 30 days initialized to 0
  const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
  const revenueMap = new Map<string, number>();
  
  days.forEach((day) => {
    revenueMap.set(format(day, "MMM dd"), 0);
  });

  // Aggregate revenue by day
  orderItems.forEach((item) => {
    const day = format(new Date(item.createdAt), "MMM dd");
    const amount = item.priceInPaise * item.quantity;
    if (revenueMap.has(day)) {
      revenueMap.set(day, revenueMap.get(day)! + amount);
    }
  });

  // Convert map to array for Recharts
  return Array.from(revenueMap.entries()).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}
