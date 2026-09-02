import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InitialData = {
  priceInPaise: number;
  stock: number;
};

interface ProductPricingSectionProps {
  initialData?: InitialData | null;
  errors?: {
    price?: string[];
    stock?: string[];
  };
}

export function ProductPricingSection({
  initialData,
  errors,
}: ProductPricingSectionProps) {
  return (
    <section className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-medium tracking-tight">Pricing & Inventory</h2>
        <p className="text-sm text-muted-foreground">
          Set the price, SKU and available inventory for your product.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            placeholder="2999"
            defaultValue={
              initialData?.priceInPaise
                ? initialData.priceInPaise / 100
                : undefined
            }
          />
          {errors?.price && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.price[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="10"
            defaultValue={initialData?.stock}
          />
          {errors?.stock && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.stock[0]}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
