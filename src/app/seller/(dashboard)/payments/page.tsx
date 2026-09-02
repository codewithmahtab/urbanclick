export const instant = false;

import { requireSeller } from "@/features/auth/lib/authorization";
import { getSellerEarnings } from "@/features/seller/services/get-seller-earnings";
import { PaymentsLedger } from "@/features/seller/components/payments/payments-ledger";
import { DashboardCard } from "@/features/seller/components/DashboardCard";
import { DollarSign, Clock, Package } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments & Earnings",
  description: "Track your store revenue, pending clearances, and full transaction ledger.",
  robots: { index: false, follow: false },
};

export default async function SellerPaymentsPage() {
  const seller = await requireSeller();
  const earnings = await getSellerEarnings(seller.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Payments & Earnings</h1>
        <p className="mt-2 text-muted-foreground">
          Track your revenue and payment history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Cleared Earnings"
          value={formatCurrency(earnings.totalEarningsInPaise)}
          icon={<DollarSign className="size-4" />}
        />
        <DashboardCard
          title="Pending Clearance"
          value={formatCurrency(earnings.pendingClearanceInPaise)}
          icon={<Clock className="size-4 text-orange-500" />}
        />
        <DashboardCard
          title="Items Sold"
          value={earnings.totalItemsSold}
          icon={<Package className="size-4" />}
        />
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Transaction Ledger</h2>
        <p className="text-sm text-muted-foreground pb-2">
          Earnings are cleared once the order is marked as DELIVERED. Cancelled items are excluded.
        </p>
        <PaymentsLedger items={earnings.ledger} />
      </div>
    </div>
  );
}
