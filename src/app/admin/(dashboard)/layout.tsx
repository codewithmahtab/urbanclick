export const instant = false;

import { requireAdmin } from "@/features/auth/lib/authorization";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { SidebarDrawer } from "@/components/ui/sidebar-drawer";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <SidebarDrawer>
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Shield className="size-5 text-primary" />
            Admin Panel
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">Platform Management</p>
        </div>

        <AdminSidebar />

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
