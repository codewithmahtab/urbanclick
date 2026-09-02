import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getCartCount } from "@/features/cart/services/get-cart-count";
import { CartBadge } from "./cart-badge";
import { getCurrentUser } from "@/features/auth/lib/dal";

export default async function CartButton() {
  const count = await getCartCount();
  const user = await getCurrentUser();

  return (
    <Link
      href="/cart"
      className="flex h-12 items-center gap-2 px-4 text-md font-light text-white relative rounded-md transition-colors"
    >
      <ShoppingCart size={18} />
      <span>Cart</span>
      <CartBadge serverCount={count} isAuthenticated={!!user} />
    </Link>
  );
}
