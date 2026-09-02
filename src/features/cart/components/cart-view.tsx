"use client";

import CartItemCard from "./cart-item-card";
import CartSummary from "./cart-summary";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EmptyCart from "./empty-cart";
import {
  useOptimisticCart,
  OptimisticCartItem,
} from "../hooks/use-optimistic-cart";
import { useCartStore } from "@/store/use-cart-store";
import { useEffect, useState } from "react";

interface CartViewProps {
  cart: {
    items: OptimisticCartItem[];
  } | null;
  isAuthenticated: boolean;
}

export default function CartView({ cart, isAuthenticated }: CartViewProps) {
  const localItems = useCartStore((state) => state.items);
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // Use server cart if available, otherwise fallback to local items (mapped to OptimisticCartItem)
  const initialItems = cart?.items || (isMounted ? localItems
    .filter(item => item.product != null)
    .map(item => ({
      id: `local-${item.productId}`,
      quantity: item.quantity,
      product: item.product
  })) : []);

  const { optimisticItems, handleQuantityChange, handleRemove, pending } =
    useOptimisticCart(initialItems);

  // Avoid hydration mismatch by waiting for mount before rendering empty cart
  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  if (optimisticItems.length === 0) {
    return <EmptyCart />;
  }

  const totalItems = optimisticItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const subtotal = optimisticItems.reduce(
    (acc, item) => acc + (item.product?.priceInPaise || 0) * item.quantity,
    0,
  );

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground">{totalItems} items</p>
        </div>

        <div className="flex flex-col">
          {optimisticItems.map((item) => {
            if (!item.product) return null;
            return (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={(q) => handleQuantityChange(item.id, q)}
                onRemove={() => handleRemove(item.id)}
              />
            );
          })}
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-30">
          <CartSummary
            totalItems={totalItems}
            subtotal={subtotal}
            pending={pending}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </div>
  );
}
