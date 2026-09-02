"use client";

import { usePathname } from "next/navigation";
import HoverDropdown from "@/components/ui/hover-dropdown";
import { Button } from "@/components/ui/button";
import DropdownContent from "./dropdown-content";
import { User as UserIcon } from "lucide-react";
import type { User } from "./account-dropdown";

export default function AccountLoginHref({ user, dropdownContent }: { user: User | null; dropdownContent: React.ReactNode }) {
  const pathname = usePathname();
  const loginHref = user ? "/account" : `/login?redirectTo=${encodeURIComponent(pathname)}`;

  return (
    <HoverDropdown href={loginHref} dropdownContent={dropdownContent}>
      <Button
        variant="outline"
        className="px-4 h-12 bg-transparent! text-md font-light text-white hover:bg-background! border-none"
      >
        <UserIcon />
        {user ? "Account" : "Login"}
      </Button>
    </HoverDropdown>
  );
}
