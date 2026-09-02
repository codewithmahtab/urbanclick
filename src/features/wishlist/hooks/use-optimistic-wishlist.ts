"use client"
import { useOptimistic, useTransition, useState, useEffect } from "react";
import { toggleWishlistAction } from "@/features/products/actions/toggle-wishlist";

export type OptimisticWishlistItem = {
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

export function useOptimisticWishlist(
  initialItems: OptimisticWishlistItem[],
  onRemoveCallback?: (productId: string) => void,
) {
  const [baseItems, setBaseItems] = useState(initialItems);

  const itemsHash = JSON.stringify(initialItems);
  useEffect(() => {
    const timer = setTimeout(() => setBaseItems(initialItems), 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsHash]);

  const [optimisticItems, setOptimisticItems] = useOptimistic(
    baseItems,
    (state, updateFn: (items: typeof baseItems) => typeof baseItems) =>
      updateFn(state),
  );

  const [, startTransition] = useTransition();

  const handleRemove = (productId: string) => {
    startTransition(async () => {
      setOptimisticItems((items) =>
        items.filter((item) => item.product.id !== productId),
      );

      await toggleWishlistAction(productId);

      setBaseItems((items) =>
        items.filter((item) => item.product.id !== productId),
      );

      if (onRemoveCallback) {
        onRemoveCallback(productId);
      }
    });
  };

  return {
    optimisticItems,
    handleRemove,
  };
}
