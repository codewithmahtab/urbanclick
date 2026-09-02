import { formatCurrency, formatDate } from "@/utils/format";
import type { SingleOrderWithItems } from "@/features/orders/services/get-orders";
import OrderItemCard from "./order-item-card";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@prisma/client";

const statusColorMap: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  SHIPPED: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  DELIVERED: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

export default function OrderCard({ order }: { order: SingleOrderWithItems }) {
  return (
    <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
      {/* Order Header */}
      <div className="bg-white/5 p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Order Placed
            </p>
            <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Total
            </p>
            <p className="text-sm font-medium">
              {formatCurrency(order.totalInPaise)}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Ship To
            </p>
            <p className="text-sm font-medium line-clamp-1" title={order.shippingFullName}>
              {order.shippingFullName}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 sm:text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Order ID
            </p>
            <p className="text-sm font-medium">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Order Status & Body */}
      <div className="p-4 sm:p-6">


        <div className="flex flex-col">
          {order.items.map((item) => (
            <OrderItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
