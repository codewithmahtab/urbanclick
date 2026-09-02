"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MoreHorizontal, Loader2, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { togglePublishProduct } from "@/features/seller/actions/products/toggle-publish-product";
import { DeleteProductModal } from "@/features/seller/components/modals/delete-product-modal";

interface ProductActionsProps {
  productId: string;
  isPublished: boolean;
  productSlug: string;
}

export function ProductActions({
  productId,
  isPublished,
  productSlug,
}: ProductActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onTogglePublish = () => {
    startTransition(() => {
      togglePublishProduct(productId, !isPublished);
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted"
              disabled={isPending}
            >
              <span className="sr-only">Open menu</span>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            render={<Link href={`/seller/products/${productSlug}/edit`} />}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit Product</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onTogglePublish} disabled={isPending}>
            {isPublished ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                <span>Unpublish</span>
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                <span>Publish</span>
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isPending}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteProductModal
        productId={productId}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
