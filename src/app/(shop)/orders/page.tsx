export const instant = false;

import type { Metadata } from "next";
import { requireSession } from "@/features/auth/lib/dal";
import { getOrders } from "@/features/orders/services/get-orders";
import OrdersView from "@/features/orders/components/orders-view";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "Track, return, or buy things again from your order history.",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  await requireSession("/orders");
  const orders = await getOrders();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track, return, or buy things again.
          </p>
        </div>
        <OrdersView orders={orders} />
      </div>
    </main>
  );
}
