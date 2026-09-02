"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const fullPath = search ? `${pathname}?${search}` : pathname;
  const encoded = encodeURIComponent(fullPath);

  return (
    <div className="px-3 pb-4 pt-2 border-b border-black/10 text-center">
      <h3 className="font-semibold text-lg mb-1">Welcome</h3>
      <p className="text-xs text-black/60 mb-4">
        Sign in to access your account
      </p>
      <Link href={`/login?redirectTo=${encoded}`}>
        <Button className="w-full h-11 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg text-md">
          Sign In
        </Button>
      </Link>
      <div className="mt-3 text-xs">
        <span className="text-black/60">New customer? </span>
        <Link
          href={`/signup?redirectTo=${encoded}`}
          className="text-blue-600 font-medium hover:underline"
        >
          Start here.
        </Link>
      </div>
    </div>
  );
}
