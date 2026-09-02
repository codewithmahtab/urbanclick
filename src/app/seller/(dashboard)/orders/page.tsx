export const instant = false;

import type { Metadata } from "next";
import { requireSeller } from "@/features/auth/lib/authorization";
import { getSellerOrders } from "@/features/seller/services/get-seller-orders";
import { SellerOrderList } from "@/features/seller/components/orders/seller-order-list";

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage incoming orders and update shipping statuses.",
  robots: { index: false, follow: false },
};

export default async function SellerOrdersPage() {
  await requireSeller();
  const items = await getSellerOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your incoming orders and update shipping statuses.
        </p>
      </div>
      <SellerOrderList items={items} />
    </div>
  );
}
