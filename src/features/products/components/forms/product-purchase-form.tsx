"use client";

import { useState, useTransition } from "react";
import { ShoppingCart, Loader2, ArrowLeftRight } from "lucide-react";
import QuantitySelector from "../product/quantity-selector";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/features/cart/actions/add-to-cart";
import { buyNowAction } from "@/features/cart/actions/buy-now";
import CartAddedModal from "@/features/cart/components/cart-added-modal";
import { useCartStore } from "@/store/use-cart-store";

interface ProductPurchaseFormProps {
  product: {
    id: string;
    name: string;
    priceInPaise: number;
    imageUrl: string;
    slug: string;
    stock: number;
  };
}

export default function ProductPurchaseForm({
  product,
}: ProductPurchaseFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [cartItemId, setCartItemId] = useState<string | null>(null);
  const [totalCartQuantity, setTotalCartQuantity] = useState(1);
  const [isPendingCart, startTransitionCart] = useTransition();
  const [isPendingBuy, startTransitionBuy] = useTransition();

  const handleAddToCart = () => {
    startTransitionCart(async () => {
      const res = await addToCartAction(product.id, quantity);
      
      if (!res.success && res.error === "UNAUTHENTICATED") {
        useCartStore.getState().addItem(product, quantity);
        const currentItem = useCartStore.getState().items.find(i => i.productId === product.id);
        const newTotal = currentItem?.quantity || quantity;
        setCartItemId(`local-${product.id}`);
        setTotalCartQuantity(newTotal);
        setShowModal(true);
        return;
      }
      
      if (res.success && res.cartItemId) {
        setCartItemId(res.cartItemId);
        if (res.totalQuantity) setTotalCartQuantity(res.totalQuantity);
        setShowModal(true);
      }
    });
  };

  const handleBuyNow = () => {
    startTransitionBuy(async () => {
      await buyNowAction(product.id, quantity);
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="default"
            className="h-12 text-md font-medium bg-white text-black disabled:opacity-100 rounded-none"
            onClick={handleAddToCart}
            disabled={isPendingCart || isPendingBuy || product.stock === 0}
          >
            {isPendingCart ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            Add to cart
          </Button>

          <Button
            type="button"
            variant="default"
            className="h-12 text-md font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-100 rounded-none"
            onClick={handleBuyNow}
            disabled={isPendingBuy || isPendingCart || product.stock === 0}
          >
            {isPendingBuy ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowLeftRight className="ml-2 h-4 w-4" />
            )}
            Buy now
          </Button>
        </div>
      </div>

      <CartAddedModal
        isOpen={showModal}
        onOpenChange={setShowModal}
        product={product}
        initialQuantity={totalCartQuantity}
        cartItemId={cartItemId}
      />
    </>
  );
}
