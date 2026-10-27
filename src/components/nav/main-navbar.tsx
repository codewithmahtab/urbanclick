import { NavButtonsSkeleton } from "@/components/skeleton/nav-buttons-skeleton";
import Link from "next/link";
import { Suspense } from "react";
import NavButtons from "./nav-buttons";
import SearchInput from "./search-input";
import CartButton from "./cart-button";
import MobileNavServer from "./mobile-nav-server";

export default function MainNavbar() {
  return (
    <nav className="flex items-center justify-center border-b h-16 max-w-400 px-4 md:px-17 mx-auto gap-4 md:gap-12">
      <Link
        href="/"
        className="flex items-center text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity shrink-0"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        <span className="text-yellow-400">Urban</span>
        <span className="text-white">Click</span>
      </Link>

      {/* Search — hidden on mobile, visible md+ */}
      <div className="hidden md:flex flex-1 min-w-0">
        <SearchInput />
      </div>

      {/* Desktop nav icons — hidden on mobile, streamed in */}
      <div className="hidden md:flex items-center gap-4 justify-center">
        <Suspense fallback={<NavButtonsSkeleton />}>
          <NavButtons />
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
      </div>

      {/* Mobile cart + hamburger — streamed in */}
      <div className="flex md:hidden items-center gap-2 ml-auto">
        <Suspense
          fallback={
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
              <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
            </div>
          }
        >
          <MobileNavServer />
        </Suspense>
      </div>
    </nav>
  );
}
