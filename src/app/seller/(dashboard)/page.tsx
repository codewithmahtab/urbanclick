export const instant = false;

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/features/auth/lib/authorization";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your seller account — products, orders, and revenue.",
  robots: { index: false, follow: false },
};
import { getSellerChartData } from "@/features/seller/services/get-seller-chart-data";
import { DashboardCard } from "@/features/seller/components/DashboardCard";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { Package, CheckCircle, Clock, DollarSign } from "lucide-react";

export default async function SellerDashboardPage() {
  const seller = await requireSeller();
  const chartData = await getSellerChartData(seller.id);

  const [productCount, activeProductCount, sellerOrderItems] = await Promise.all([
    prisma.product.count({
      where: {
        sellerId: seller.id,
        isDeleted: false,
      },
    }),

    prisma.product.count({
      where: {
        sellerId: seller.id,
        isPublished: true,
        isDeleted: false,
      },
    }),

    prisma.orderItem.findMany({
      where: {
        product: {
          sellerId: seller.id,
        },
      },
      select: {
        status: true,
        quantity: true,
        priceInPaise: true,
      }
    }),
  ]);

  const pendingOrdersCount = sellerOrderItems.filter(
    (item) => item.status === "PENDING" || item.status === "PROCESSING"
  ).length;

  const totalSalesInPaise = sellerOrderItems
    .filter((item) => item.status !== "CANCELLED")
    .reduce((acc, item) => acc + item.quantity * item.priceInPaise, 0);

  const formatCurrency = (amountInPaise: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amountInPaise / 100);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Seller Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back to your seller center, {seller.storeName}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Products" 
          value={productCount} 
          icon={<Package className="size-4" />} 
        />
        <DashboardCard 
          title="Published Products" 
          value={activeProductCount} 
          icon={<CheckCircle className="size-4" />} 
        />
        <DashboardCard 
          title="Pending Orders" 
          value={pendingOrdersCount} 
          icon={<Clock className="size-4" />} 
        />
        <DashboardCard 
          title="Total Sales" 
          value={formatCurrency(totalSalesInPaise)} 
          icon={<DollarSign className="size-4" />} 
        />
      </div>

      <div className="mt-8">
        <RevenueChart data={chartData} />
      </div>
    </div>
  );
}
