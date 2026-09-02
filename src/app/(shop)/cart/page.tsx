export const instant = false;

import type { Metadata } from "next";
import { getCurrentUser } from "@/features/auth/lib/dal";
import CartView from "@/features/cart/components/cart-view";
import { getCart } from "@/features/cart/services/get-cart";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review items in your cart and proceed to checkout.",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const user = await getCurrentUser();
  
  const cart = user ? await getCart() : null;

  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <CartView cart={cart} isAuthenticated={!!user} />
      </div>
    </main>
  );
}
