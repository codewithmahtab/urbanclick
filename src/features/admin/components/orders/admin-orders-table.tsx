import { formatDistanceToNow } from "date-fns";
import { formatCurrency } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { OrderStatus } from "@prisma/client";
import type { AdminOrderItem } from "@/features/admin/services/get-all-orders";

const statusColorMap: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 border-none",
  PROCESSING: "bg-blue-500/10 text-blue-500 border-none",
  SHIPPED: "bg-purple-500/10 text-purple-500 border-none",
  DELIVERED: "bg-green-500/10 text-green-500 border-none",
  CANCELLED: "bg-red-500/10 text-red-500 border-none",
};

interface AdminOrdersTableProps {
  orders: AdminOrderItem[];
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed gap-3 text-center">
        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">No orders placed yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order ID</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Placed</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-mono text-xs">
                #{order.id.slice(-8).toUpperCase()}
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium">{order.shippingFullName}</p>
                  <p className="text-xs text-muted-foreground">{order.user.email}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {order.items.reduce((acc, i) => acc + i.quantity, 0)} item
                {order.items.reduce((acc, i) => acc + i.quantity, 0) !== 1 ? "s" : ""}
              </td>
              <td className="px-4 py-3 font-medium">
                {formatCurrency(order.totalInPaise)}
              </td>
              <td className="px-4 py-3">
                <Badge className={`text-xs font-semibold uppercase ${statusColorMap[order.status]}`}>
                  {order.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
