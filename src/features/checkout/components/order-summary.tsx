import { formatCurrency } from "@/utils/format";
import { ProductImage } from "@/components/ui/product-image";

interface OrderSummaryProps {
  cart: {
    items: {
      id: string;
      quantity: number;
      product: {
        name: string;
        priceInPaise: number;
        imageUrl: string;
      };
    }[];
  };
}

export default function OrderSummary({ cart }: OrderSummaryProps) {
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.product.priceInPaise * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 5000 : 0; // 50 flat rate
  const total = subtotal + shipping;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm sticky top-24">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      <div className="flex flex-col gap-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
              <ProductImage
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <h3 className="text-sm font-medium line-clamp-2">
                {item.product.name}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </span>
                <span className="text-sm font-bold">
                  {formatCurrency(item.product.priceInPaise)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? "Free" : formatCurrency(shipping)}
          </span>
        </div>
        <div className="flex justify-between pt-4 border-t text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
