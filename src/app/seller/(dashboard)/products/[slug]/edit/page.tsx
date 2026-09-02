export const instant = false;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireSeller } from "@/features/auth/lib/authorization";
import { SellerProductForm } from "@/features/seller/forms/product/seller-product-form";
import { getSellerProductFormData } from "@/features/seller/services/product/get-product-form-data";
import { getSellerProductBySlug } from "@/features/seller/services/product/get-seller-product";

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Update your product listing details, pricing, and inventory.",
  robots: { index: false, follow: false },
};

interface EditProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const seller = await requireSeller();
  const { slug } = await params;

  const [formData, product] = await Promise.all([
    getSellerProductFormData(),
    getSellerProductBySlug(slug, seller.id),
  ]);

  if (!product) {
    return notFound();
  }

  const { categories, brands } = formData;

  return (
    <div className="py-6">
      <SellerProductForm
        categories={categories}
        brands={brands}
        initialData={product}
      />
    </div>
  );
}
