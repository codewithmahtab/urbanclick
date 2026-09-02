import { ProductImage } from "@/components/ui/product-image";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import type { SingleOrderItem } from "@/features/orders/services/get-orders";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@prisma/client";

const itemStatusColorMap: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  SHIPPED: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  DELIVERED: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

export default function OrderItemCard({ item }: { item: SingleOrderItem }) {
  return (
    <div className="flex gap-4 py-4 sm:py-6 border-b border-white/10 last:border-0 items-start">
      <Link href={`/product/${item.product.slug}`} className="shrink-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-lg overflow-hidden border border-white/10 group">
          <ProductImage
            src={item.product.imageUrl}
            alt={item.productName}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/product/${item.product.slug}`}
                className="font-medium text-base sm:text-lg hover:underline line-clamp-2"
              >
                {item.productName}
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-1">SKU: {item.sku}</p>
            <div className="mt-2">
              <Badge className={`rounded-full px-2.5 py-0 border-none text-xs font-semibold uppercase ${itemStatusColorMap[item.status]}`}>
                {item.status}
              </Badge>
            </div>
          </div>
          
          <div className="text-left sm:text-right mt-2 sm:mt-0">
            <p className="font-medium text-lg">
              {formatCurrency(item.priceInPaise)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Qty: {item.quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
