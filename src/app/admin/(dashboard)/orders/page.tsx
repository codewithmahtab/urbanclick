export const instant = false;

import { requireAdmin } from "@/features/auth/lib/authorization";
import { getAllOrders } from "@/features/admin/services/get-all-orders";
import { AdminOrdersTable } from "@/features/admin/components/orders/admin-orders-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
  description: "View and manage all orders placed on the platform.",
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getAllOrders();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-2 text-muted-foreground">
            All orders placed across the platform. Showing most recent 100.
          </p>
        </div>
        <span className="text-sm text-muted-foreground">{orders.length} orders</span>
      </div>
      <AdminOrdersTable orders={orders} />
    </div>
  );
}
