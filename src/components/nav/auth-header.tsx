import Link from "next/link";
import SearchInput from "./search-input";
import { Suspense } from "react";
import CartButton from "./cart-button";

export default function AuthHeader() {
  return (
    <nav className="flex w-full items-center justify-center border-b h-16 max-w-410 px-17 mx-auto gap-12">
      <Link
        href="/"
        className="flex items-center text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity shrink-0"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        <span className="text-yellow-400">Urban</span>
        <span className="text-white">Click</span>
      </Link>

      <Suspense
        fallback={
          <div className="relative flex-1">
            <div className="w-full h-11 bg-muted animate-pulse rounded-none" />
          </div>
        }
      >
        <SearchInput />
      </Suspense>

      <Suspense
        fallback={
          <div className="flex h-12 items-center px-4 w-24">
            <div className="w-16 h-5 bg-muted rounded-full animate-pulse" />
          </div>
        }
      >
        <CartButton />
      </Suspense>
    </nav>
  );
}
