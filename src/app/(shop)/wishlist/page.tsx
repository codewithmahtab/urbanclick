export const instant = false;

import type { Metadata } from "next";
import { getWishlist } from "@/features/wishlist/services/get-wishlist";
import WishlistView from "@/features/wishlist/components/wishlist-view";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "View and manage your saved products.",
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const wishlist = await getWishlist();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <WishlistView wishlist={wishlist} />
      </div>
    </main>
  );
}
