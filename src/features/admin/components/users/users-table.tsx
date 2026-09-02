import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, XCircle } from "lucide-react";
import type { AdminUserItem } from "@/features/admin/services/get-all-users";

interface UsersTableProps {
  users: AdminUserItem[];
}

export function UsersTable({ users }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed gap-3 text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">No users found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Verified</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Orders</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium">{user.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                  className="text-xs uppercase"
                >
                  {user.role}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {user.isVerified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{user._count.orders}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
