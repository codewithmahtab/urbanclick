export const instant = false;

import { requireAdmin } from "@/features/auth/lib/authorization";
import { getAllSellers } from "@/features/admin/services/get-all-sellers";
import { SellerManagementTable } from "@/features/admin/components/sellers/seller-management-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sellers",
  description: "Review and manage seller applications and approved seller accounts.",
  robots: { index: false, follow: false },
};

export default async function AdminSellersPage() {
  await requireAdmin();
  const sellers = await getAllSellers();

  const pending = sellers.filter((s) => s.status === "PENDING");
  const others = sellers.filter((s) => s.status !== "PENDING");
  const sorted = [...pending, ...others];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Sellers</h1>
          <p className="mt-2 text-muted-foreground">
            Manage seller registrations and account status.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{sellers.length} total</span>
          {pending.length > 0 && (
            <span className="font-medium text-orange-500">
              {pending.length} pending
            </span>
          )}
        </div>
      </div>
      <SellerManagementTable sellers={sorted} />
    </div>
  );
}
