"use client";

import { ProductImage } from "@/components/ui/product-image";
import Link from "next/link";
import { Trash2, ShoppingCart, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { useTransition } from "react";
import { addToCartAction } from "@/features/cart/actions/add-to-cart";
import { useRouter } from "next/navigation";

interface WishlistItemCardProps {
  item: {
    id: string;
    product: {
      id: string;
      name: string;
      priceInPaise: number;
      imageUrl: string;
      slug: string;
      stock: number;
    };
  };
  onRemove?: () => void;
}

export default function WishlistItemCard({
  item,
  onRemove,
}: WishlistItemCardProps) {
  const [isPendingCart, startTransitionCart] = useTransition();
  const router = useRouter();

  const handleAddToCart = () => {
    startTransitionCart(async () => {
      await addToCartAction(item.product.id, 1);
      router.push("/cart");
    });
  };

  return (
    <div
      className={`flex flex-col sm:flex-row gap-6 border rounded-xl p-4 transition-opacity opacity-100`}
    >
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
        <ProductImage
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          sizes="(max-width: 768px) 100vw, 128px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link
              href={`/product/${item.product.slug}`}
              className="text-lg font-semibold hover:underline line-clamp-2"
            >
              {item.product.name}
            </Link>
            <p className="mt-1 text-md font-bold">
              {formatCurrency(item.product.priceInPaise)}
            </p>

            <p
              className={`flex items-center gap-1.5 text-sm font-medium mt-2 ${
                item.product.stock > 0 ? "text-green-600" : "text-destructive"
              }`}
            >
              {item.product.stock > 0 && <Check size={14} />}
              {item.product.stock > 0 ? "In stock" : "Out of stock"}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-muted-foreground hover:text-red-500 hover:bg-red-50 shrink-0"
          >
            <Trash2 className="size-5" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center justify-start sm:justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-full p-5 font-medium"
            disabled={isPendingCart || item.product.stock === 0}
            onClick={handleAddToCart}
          >
            {isPendingCart ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
