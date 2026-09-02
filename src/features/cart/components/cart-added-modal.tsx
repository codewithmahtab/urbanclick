"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import CartItemCard from "./cart-item-card";
import { useOptimisticCart } from "../hooks/use-optimistic-cart";

interface CartAddedModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    priceInPaise: number;
    imageUrl: string;
    slug: string;
  };
  initialQuantity: number;
  cartItemId: string | null;
}

export default function CartAddedModal({
  isOpen,
  onOpenChange,
  product,
  initialQuantity,
  cartItemId,
}: CartAddedModalProps) {
  const initialItems = cartItemId
    ? [
        {
          id: cartItemId,
          quantity: initialQuantity,
          product,
        },
      ]
    : [];

  const { optimisticItems, handleQuantityChange, handleRemove } =
    useOptimisticCart(initialItems, () => onOpenChange(false));

  const currentItem = optimisticItems[0];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
            Added to your cart
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          {currentItem && (
            <CartItemCard
              item={currentItem}
              onUpdateQuantity={(q) => handleQuantityChange(currentItem.id, q)}
              onRemove={() => handleRemove(currentItem.id)}
            />
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end bg-muted/30 p-6 mt-2 border-t">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-12 rounded-none"
          >
            Continue Shopping
          </Button>
          <Link href="/cart" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full h-12 bg-orange-500 text-white hover:bg-orange-600 rounded-none text-md"
            >
              View full cart
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
