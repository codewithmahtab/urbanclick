"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { ProductInfoSection } from "./product-info-section";
import { ProductPricingSection } from "./product-pricing-section";
import { createProduct } from "../../actions/products/create-product";
import { updateProduct } from "../../actions/products/update-product";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Category = { id: string; name: string; slug: string };
type Brand = { id: string; name: string; slug: string };

type InitialData = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  brandId: string | null;
  categories: { categoryId: string }[];
  priceInPaise: number;
  stock: number;
};

interface SellerProductFormProps {
  categories: Category[];
  brands: Brand[];
  initialData?: InitialData | null;
}

export function SellerProductForm({
  categories,
  brands,
  initialData,
}: SellerProductFormProps) {
  const action = initialData
    ? updateProduct.bind(null, initialData.id)
    : createProduct;

  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {initialData ? "Edit Product" : "Add Product"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {initialData
            ? "Update your existing product listing."
            : "Create a new product listing for your store."}
        </p>
      </div>

      <form className="space-y-8" action={formAction}>
        {isPending && (
          <div className="fixed top-0 right-0 bottom-0 left-64 z-50 bg-background/20 cursor-not-allowed" />
        )}
        
        <ProductInfoSection
          categories={categories}
          brands={brands}
          errors={state.fieldErrors}
          initialData={initialData}
        />

        <ProductPricingSection
          errors={state.fieldErrors}
          initialData={initialData}
        />

        {state.formError && (
          <p className="text-sm font-medium text-destructive text-center">
            {state.formError}
          </p>
        )}

        <div className="flex justify-end gap-4">
          <Button
            render={<Link href="/seller/products" />}
            variant="outline"
            className="h-11 px-8"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="h-11 px-8 min-w-[140px]">
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : initialData ? (
              "Save Changes"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
