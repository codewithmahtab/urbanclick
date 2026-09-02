"use client";

import { useCartStore } from "@/store/use-cart-store";
import { useEffect, useState } from "react";

export function CartBadge({ serverCount, isAuthenticated }: { serverCount: number; isAuthenticated: boolean }) {
  const localItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const localCount = localItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    // If authenticated, we clear the local store since it has been merged on the server
    if (isAuthenticated && localItems.length > 0) {
      clearCart();
    }
  }, [isAuthenticated, localItems.length, clearCart]);

  // Use local count if the user is not authenticated, otherwise use server count
  const displayCount = isAuthenticated ? serverCount : (isMounted ? localCount : 0);

  if (displayCount === 0) return null;

  return (
    <span className="absolute top-1 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[12px] font-medium text-black border-2 border-background">
      {displayCount > 99 ? "99+" : displayCount}
    </span>
  );
}
