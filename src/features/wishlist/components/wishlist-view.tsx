"use client";

import EmptyWishlist from "./empty-wishlist";
import WishlistItemCard from "./wishlist-item-card";
import {
  useOptimisticWishlist,
  OptimisticWishlistItem,
} from "../hooks/use-optimistic-wishlist";

interface WishlistViewProps {
  wishlist: {
    items: OptimisticWishlistItem[];
  } | null;
}

export default function WishlistView({ wishlist }: WishlistViewProps) {
  const initialItems = wishlist?.items || [];
  const { optimisticItems, handleRemove } = useOptimisticWishlist(initialItems);

  if (optimisticItems.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between border-b pb-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Wishlist</h1>
        <p className="text-muted-foreground">{optimisticItems.length} items</p>
      </div>

      <div className="flex flex-col gap-4">
        {optimisticItems.map((item) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            onRemove={() => handleRemove(item.product.id)}
          />
        ))}
      </div>
    </div>
  );
}
