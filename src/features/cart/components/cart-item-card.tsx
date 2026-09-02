"use client";

import { ProductImage } from "@/components/ui/product-image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/features/products/components/product/quantity-selector";
import { formatCurrency } from "@/utils/format";

interface CartItemCardProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      priceInPaise: number;
      imageUrl: string;
      slug: string;
    };
  };
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}

export default function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="flex gap-4 sm:gap-6 border-b py-4 sm:py-6 transition-opacity">
      <div className="relative h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-md bg-muted">
        <ProductImage
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/product/${item.product.slug}`}
              className="text-lg font-semibold hover:underline"
            >
              {item.product.name}
            </Link>
            <p className="mt-1 text-md font-medium text-muted-foreground">
              {formatCurrency(item.product.priceInPaise)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-muted-foreground -mt-2 -mr-2"
          >
            <Trash2 className="size-5" />
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <QuantitySelector
            quantity={item.quantity}
            onChange={onUpdateQuantity}
            showLabel={false}
          />
          <p className="text-lg font-bold">
            {formatCurrency(item.product.priceInPaise * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
