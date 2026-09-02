"use client";

import { useTransition } from "react";
import { formatCurrency } from "@/utils/format";
import { formatDistanceToNow } from "date-fns";
import { OrderStatus } from "@prisma/client";
import { updateOrderItemStatus } from "@/features/seller/actions/update-order-item-status";
import { Loader2 } from "lucide-react";
import { ProductImage } from "@/components/ui/product-image";
import { toast } from "sonner";

interface SellerOrderListProps {
  items: Array<{
    id: string;
    quantity: number;
    priceInPaise: number;
    status: OrderStatus;
    createdAt: Date;
    product: {
      name: string;
      imageUrl: string;
    };
    order: {
      id: string;
      status: OrderStatus;
      shippingFullName: string;
      shippingAddressLine: string;
      shippingCity: string;
      shippingState: string;
      shippingPincode: string;
    };
  }>;
}

export function SellerOrderList({ items }: SellerOrderListProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (orderItemId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      const result = await updateOrderItemStatus(orderItemId, newStatus);
      if (result.success) {
        toast.success("Order status updated successfully");
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <p className="text-muted-foreground">You have no pending orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-start gap-4 md:items-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-md border">
              <ProductImage
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium leading-none">{item.product.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Qty: {item.quantity} × {formatCurrency(item.priceInPaise)}
              </p>
              <div className="mt-2 flex flex-col text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  Ship to: {item.order.shippingFullName}
                </span>
                <span>
                  {item.order.shippingAddressLine}, {item.order.shippingCity},{" "}
                  {item.order.shippingState} {item.order.shippingPincode}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 border-t pt-4 md:border-0 md:pt-0">
            <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
              <span className="font-mono text-xs text-foreground bg-muted px-2 py-1 rounded-md">
                Order #{item.order.id.slice(-8).toUpperCase()}
              </span>
              <span>
                Ordered {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              <div className="flex flex-col items-end gap-1">
                <select
                  disabled={isPending}
                  value={item.status}
                  onChange={(e) =>
                    handleStatusChange(item.id, e.target.value as OrderStatus)
                  }
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {item.order.status === "CANCELLED" && (
                  <span className="text-[10px] font-semibold text-red-500 uppercase">
                    Entire order cancelled
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
