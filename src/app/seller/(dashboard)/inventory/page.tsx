export const instant = false;

import { requireSeller } from "@/features/auth/lib/authorization";
import { getSellerInventory } from "@/features/seller/services/inventory/get-seller-inventory";
import { InventoryTable } from "@/features/seller/components/inventory/inventory-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Manage your product stock levels. Click any value to edit in place.",
  robots: { index: false, follow: false },
};

export default async function SellerInventoryPage() {
  const seller = await requireSeller();
  const items = await getSellerInventory(seller.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
        <p className="mt-2 text-muted-foreground">
          Click any stock number to edit it in place.
        </p>
      </div>
      <InventoryTable items={items} />
    </div>
  );
}
