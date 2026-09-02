export const instant = false;

import type { Metadata } from "next";
import { requireSeller } from "@/features/auth/lib/authorization";
import { getSellerProducts } from "@/features/seller/services/product/get-seller-products";
import { formatCurrency } from "@/utils/format";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductActions } from "@/features/seller/components/products/product-actions";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your product listings — add, edit, publish, and remove products.",
  robots: { index: false, follow: false },
};

export default async function SellerProductsPage() {
  const seller = await requireSeller();
  const products = await getSellerProducts(seller.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your products and inventory.
          </p>
        </div>

        <Button render={<Link href="/seller/products/new" />} className="h-10 px-4">
          Add Product
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead className="w-[20%]">Price</TableHead>
              <TableHead className="w-[15%]">Stock</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium truncate" title={product.name}>
                      {product.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(product.priceInPaise)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge variant={product.isPublished ? "default" : "secondary"}>
                    {product.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ProductActions
                    productSlug={product.slug}
                    productId={product.id}
                    isPublished={product.isPublished}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">
              You haven&apos;t created any products yet.
            </p>
            <Link
              href="/seller/products/new"
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              Create your first product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
