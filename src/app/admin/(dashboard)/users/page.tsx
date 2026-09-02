export const instant = false;

import { requireAdmin } from "@/features/auth/lib/authorization";
import { getAllUsers } from "@/features/admin/services/get-all-users";
import { UsersTable } from "@/features/admin/components/users/users-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "View and manage all registered users on the platform.",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getAllUsers();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
          <p className="mt-2 text-muted-foreground">
            View all registered users on the platform.
          </p>
        </div>
        <span className="text-sm text-muted-foreground">{users.length} total</span>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
