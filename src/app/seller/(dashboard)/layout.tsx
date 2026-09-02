export const instant = false;

import { requireSeller } from "@/features/auth/lib/authorization";
import { SellerSidebar } from "@/features/seller/components/seller-sidebar";
import { SidebarDrawer } from "@/components/ui/sidebar-drawer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seller = await requireSeller();

  return (
    <div className="flex min-h-screen">
      <SidebarDrawer>
        <div className="p-6 border-b">
          <Link href="/seller" className="text-xl font-semibold tracking-tight">
            Seller Center
          </Link>

          <p className="mt-1 text-sm text-muted-foreground truncate">
            {seller.storeName}
          </p>
        </div>

        <SellerSidebar />

        <div className="mt-auto border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Shop
          </Link>
        </div>
      </SidebarDrawer>

      <main className="min-w-0 flex-1 p-4 md:p-8 bg-muted/20">{children}</main>
    </div>
  );
}
