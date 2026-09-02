"use client";

import { useState, useTransition, useRef } from "react";
import { ProductImage } from "@/components/ui/product-image";
import { toast } from "sonner";
import { Loader2, PackageX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateStock } from "@/features/seller/actions/inventory/update-stock";
import type { SellerInventoryItem } from "@/features/seller/services/inventory/get-seller-inventory";

const LOW_STOCK_THRESHOLD = 10;

interface StockCellProps {
  productId: string;
  initialStock: number;
}

function StockCell({ productId, initialStock }: StockCellProps) {
  const [stock, setStock] = useState(initialStock);
  const [editValue, setEditValue] = useState(String(initialStock));
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = () => {
    setEditValue(String(stock));
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleSave = () => {
    const parsed = parseInt(editValue, 10);
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Stock must be a non-negative number.");
      setEditValue(String(stock));
      setIsEditing(false);
      return;
    }

    if (parsed === stock) {
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    startTransition(async () => {
      const result = await updateStock(productId, parsed);
      if (result.success) {
        setStock(parsed);
        toast.success("Stock updated.");
      } else {
        toast.error(result.error || "Failed to update stock.");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(String(stock));
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : isEditing ? (
        <input
          ref={inputRef}
          type="number"
          min={0}
          value={editValue}
          autoFocus
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-20 h-8 rounded-md border border-ring bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <button
          onClick={handleStartEdit}
          title="Click to edit stock"
          className="min-w-[3rem] h-8 px-2 text-sm font-medium rounded-md hover:bg-muted transition-colors cursor-pointer text-left"
        >
          {stock}
        </button>
      )}

      {!isPending && !isEditing && stock === 0 && (
        <Badge className="bg-red-500/10 text-red-500 border-none text-xs">
          Out of stock
        </Badge>
      )}
      {!isPending && !isEditing && stock > 0 && stock <= LOW_STOCK_THRESHOLD && (
        <Badge className="bg-orange-500/10 text-orange-500 border-none text-xs">
          Low stock
        </Badge>
      )}
    </div>
  );
}

interface InventoryTableProps {
  items: SellerInventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed gap-3 text-center">
        <PackageX className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">
          No products yet. Add a product to start managing inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground w-[40%]">Product</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground w-[20%]">SKU</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground w-[15%]">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground w-[25%]">
              Stock{" "}
              <span className="text-xs font-normal">(click to edit)</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                    <ProductImage
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium truncate max-w-[200px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {item.sku}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={item.isPublished ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.isPublished ? "Published" : "Draft"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <StockCell productId={item.id} initialStock={item.stock} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
