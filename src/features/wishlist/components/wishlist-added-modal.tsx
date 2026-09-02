import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import WishlistItemCard from "./wishlist-item-card";
import { useOptimisticWishlist } from "../hooks/use-optimistic-wishlist";
import { useEffect, useState } from "react";

interface WishlistAddedModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    priceInPaise: number;
    imageUrl: string;
    slug: string;
    stock: number;
  };
}

export default function WishlistAddedModal({
  isOpen,
  onOpenChange,
  product,
}: WishlistAddedModalProps) {
  // We recreate the initial state every time the modal opens
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Use a timeout to defer the state update out of the synchronous effect body
      const timer = setTimeout(() => setModalKey((prev) => prev + 1), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const initialItems = [
    {
      id: "temp-id",
      product,
    },
  ];

  const { optimisticItems, handleRemove } = useOptimisticWishlist(
    initialItems,
    () => onOpenChange(false),
  );

  const currentItem = optimisticItems[0];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        key={modalKey}
        className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl"
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Heart className="h-7 w-7 text-red-500 fill-red-500" />
            Added to your wishlist
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          {currentItem && (
            <WishlistItemCard
              item={currentItem}
              onRemove={() => handleRemove(currentItem.product.id)}
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
          <Link href="/wishlist" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full h-12 bg-yellow-400 text-black hover:bg-yellow-500 rounded-none text-md"
            >
              View Wishlist
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
