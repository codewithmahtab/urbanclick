import { formatDistanceToNow } from "date-fns";
import { formatCurrency } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { OrderStatus } from "@prisma/client";
import type { SellerLedgerItem } from "@/features/seller/services/get-seller-earnings";

const statusColorMap: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 border-none",
  PROCESSING: "bg-blue-500/10 text-blue-500 border-none",
  SHIPPED: "bg-purple-500/10 text-purple-500 border-none",
  DELIVERED: "bg-green-500/10 text-green-500 border-none",
  CANCELLED: "bg-red-500/10 text-red-500 border-none",
};

interface PaymentsLedgerProps {
  items: SellerLedgerItem[];
}

export function PaymentsLedger({ items }: PaymentsLedgerProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed gap-3 text-center">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order ID</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Qty</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-mono text-xs">
                #{item.order.id.slice(-8).toUpperCase()}
              </td>
              <td className="px-4 py-3">
                <span className="font-medium">{item.productName}</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {item.quantity}
              </td>
              <td className="px-4 py-3 font-medium">
                {formatCurrency(item.priceInPaise * item.quantity)}
              </td>
              <td className="px-4 py-3">
                <Badge className={`text-xs font-semibold uppercase ${statusColorMap[item.status]}`}>
                  {item.status === "DELIVERED" ? "Cleared" : "Pending"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
