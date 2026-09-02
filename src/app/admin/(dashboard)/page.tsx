export const instant = false;

import type { Metadata } from "next";
import { requireAdmin } from "@/features/auth/lib/authorization";
import { getAdminStats } from "@/features/admin/services/get-admin-stats";
import { getAdminChartData } from "@/features/admin/services/get-admin-chart-data";
import { DashboardCard } from "@/features/seller/components/DashboardCard";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { Users, Store, Package, ShoppingBag, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Overview",
  description: "Platform administration dashboard — users, sellers, orders, and revenue.",
  robots: { index: false, follow: false },
};

function formatCurrency(amountInPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInPaise / 100);
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminStats();
  const chartData = await getAdminChartData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 text-muted-foreground">
          Platform-wide metrics and activity at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="size-4" />}
        />
        <DashboardCard
          title="Total Sellers"
          value={stats.totalSellers}
          icon={<Store className="size-4" />}
        />
        <DashboardCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="size-4" />}
        />
        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag className="size-4" />}
        />
        <DashboardCard
          title="Platform Revenue"
          value={formatCurrency(stats.totalRevenueInPaise)}
          icon={<DollarSign className="size-4" />}
        />
        <DashboardCard
          title="Pending Seller Approvals"
          value={stats.pendingSellers}
          icon={<Clock className="size-4" />}
        />
      </div>

      {stats.pendingSellers > 0 && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-orange-500">
              {stats.pendingSellers} seller application{stats.pendingSellers > 1 ? "s" : ""} awaiting review
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Review and approve or reject pending seller registrations.
            </p>
          </div>
          <Link
            href="/admin/sellers"
            className="text-sm font-medium text-orange-500 hover:underline shrink-0 ml-4"
          >
            Review Now →
          </Link>
        </div>
      )}

      <div className="mt-8">
        <RevenueChart data={chartData} />
      </div>
    </div>
  );
}
