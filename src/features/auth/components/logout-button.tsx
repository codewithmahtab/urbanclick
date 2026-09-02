"use client";

import { useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logout } from "@/features/auth/actions/logout";
import { Loader2 } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({
  className,
  children,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    const search = searchParams.toString();
    const fullPath = search ? `${pathname}?${search}` : pathname;
    startTransition(async () => {
      await logout(fullPath);
    });
  };

  return (
    <form onSubmit={handleLogout} className="w-full">
      <button
        type="submit"
        disabled={isPending}
        className={
          className || "text-red-400 hover:text-red-300 cursor-pointer"
        }
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : children || "Logout"}
      </button>
    </form>
  );
}
