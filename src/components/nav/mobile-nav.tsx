"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, Store, Home, Search } from "lucide-react";

type MobileNavProps = {
  user: { id: string; name: string; email: string; role: string } | null;
  isSeller: boolean;
  cartCount: number;
};

export default function MobileNav({ user, isSeller, cartCount }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setOpen(false);

  const sellerHref = isSeller ? "/seller" : "/seller/register";
  const sellerLabel = isSeller ? "Seller Dashboard" : "Become a Seller";
  const accountHref = user ? "/account" : `/login?redirectTo=${encodeURIComponent(pathname)}`;

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex md:hidden items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-white/10 transition-colors"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={close}
        />
      )}

      <div
        className={[
          "fixed top-0 right-0 z-50 h-full w-72 bg-card border-l border-white/10 flex flex-col md:hidden",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10 shrink-0">
          <Link
            href="/"
            onClick={close}
            className="flex items-center text-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            <span className="text-yellow-400">Next</span>
            <span className="text-white">Shop</span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-white/10 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
          >
            <Home className="size-4 shrink-0" />
            Home
          </Link>

          <Link
            href="/search"
            onClick={close}
            className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
          >
            <Search className="size-4 shrink-0" />
            Search
          </Link>

          <Link
            href="/cart"
            onClick={close}
            className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
          >
            <ShoppingCart className="size-4 shrink-0" />
            Cart
            {cartCount > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 text-black text-xs font-bold px-1">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <Link
            href={accountHref}
            onClick={close}
            className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
          >
            <User className="size-4 shrink-0" />
            {user ? "My Account" : "Login"}
          </Link>

          <Link
            href={sellerHref}
            onClick={close}
            className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
          >
            <Store className="size-4 shrink-0" />
            {sellerLabel}
          </Link>
        </nav>

        {user && (
          <div className="shrink-0 border-t border-white/10 px-5 py-4">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
      </div>
    </>
  );
}
