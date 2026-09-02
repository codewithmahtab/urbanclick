import { useOptimistic, useTransition, useState, useEffect } from "react";
import { updateCartItemAction } from "@/features/cart/actions/update-cart-item";
import { removeCartItemAction } from "@/features/cart/actions/remove-cart-item";
import { useCartStore } from "@/store/use-cart-store";

export type OptimisticCartItem = {
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

export function useOptimisticCart(
  initialItems: OptimisticCartItem[],
  onRemoveCallback?: (id: string) => void,
) {
  const [baseItems, setBaseItems] = useState(initialItems);

  // Sync baseItems if initialItems from server change (for CartView RSC)
  // We use JSON.stringify to avoid infinite loops if the parent passes a new array reference every render
  const itemsHash = JSON.stringify(initialItems);
  useEffect(() => {
    setBaseItems(initialItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsHash]);

  const [optimisticItems, setOptimisticItems] = useOptimistic(
    baseItems,
    (state, updateFn: (items: typeof baseItems) => typeof baseItems) =>
      updateFn(state),
  );

  const [pending, startTransition] = useTransition();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (id.startsWith("local-")) {
      const productId = id.replace("local-", "");
      useCartStore.getState().updateQuantity(productId, newQuantity);
      setBaseItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        ),
      );
      return;
    }

    startTransition(async () => {
      setOptimisticItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        ),
      );
      await updateCartItemAction(id, newQuantity);

      setBaseItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        ),
      );
    });
  };

  const handleRemove = (id: string) => {
    if (id.startsWith("local-")) {
      const productId = id.replace("local-", "");
      useCartStore.getState().removeItem(productId);
      setBaseItems((items) => items.filter((item) => item.id !== id));
      if (onRemoveCallback) onRemoveCallback(id);
      return;
    }

    startTransition(async () => {
      setOptimisticItems((items) => items.filter((item) => item.id !== id));
      await removeCartItemAction(id);

      setBaseItems((items) => items.filter((item) => item.id !== id));
      if (onRemoveCallback) {
        onRemoveCallback(id);
      }
    });
  };

  return {
    optimisticItems,
    handleQuantityChange,
    handleRemove,
    pending,
  };
}
