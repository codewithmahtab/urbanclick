"use client";

import { useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { SellerStatus } from "@prisma/client";
import { toast } from "sonner";
import { Loader2, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateSellerStatus } from "@/features/admin/actions/update-seller-status";
import type { AdminSellerItem } from "@/features/admin/services/get-all-sellers";

const statusColorMap: Record<SellerStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500 border-none",
  APPROVED: "bg-green-500/10 text-green-500 border-none",
  REJECTED: "bg-red-500/10 text-red-500 border-none",
  SUSPENDED: "bg-gray-500/10 text-gray-500 border-none",
};

function SellerRow({ seller }: { seller: AdminSellerItem }) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (newStatus: SellerStatus) => {
    startTransition(async () => {
      const result = await updateSellerStatus(seller.id, newStatus);
      if (result.success) {
        toast.success(`Seller ${newStatus.toLowerCase()} successfully.`);
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    });
  };

  return (
    <tr className="border-b hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-sm">{seller.storeName}</p>
          <p className="text-xs text-muted-foreground">{seller.user.email}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {seller.city}, {seller.state}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {seller._count.products}
      </td>
      <td className="px-4 py-3">
        <Badge className={`text-xs font-semibold uppercase ${statusColorMap[seller.status]}`}>
          {seller.status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(seller.createdAt), { addSuffix: true })}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {(seller.status === "PENDING" || seller.status === "REJECTED") && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs text-green-600 border-green-600/30 hover:bg-green-500/10"
              onClick={() => handleAction("APPROVED")}
              disabled={isPending}
            >
              Approve
            </Button>
          )}
          {seller.status === "PENDING" && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs text-red-500 border-red-500/30 hover:bg-red-500/10"
              onClick={() => handleAction("REJECTED")}
              disabled={isPending}
            >
              Reject
            </Button>
          )}
          {seller.status === "APPROVED" && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs text-gray-500 border-gray-500/30 hover:bg-gray-500/10"
              onClick={() => handleAction("SUSPENDED")}
              disabled={isPending}
            >
              Suspend
            </Button>
          )}
          {seller.status === "SUSPENDED" && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs text-green-600 border-green-600/30 hover:bg-green-500/10"
              onClick={() => handleAction("APPROVED")}
              disabled={isPending}
            >
              Reactivate
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

interface SellerManagementTableProps {
  sellers: AdminSellerItem[];
}

export function SellerManagementTable({ sellers }: SellerManagementTableProps) {
  if (sellers.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed gap-3 text-center">
        <Store className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">No sellers registered yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Seller</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Products</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Registered</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sellers.map((seller) => (
            <SellerRow key={seller.id} seller={seller} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
