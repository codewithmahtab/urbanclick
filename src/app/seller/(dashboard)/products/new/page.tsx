export const instant = false;

import type { Metadata } from "next";
import { requireSeller } from "@/features/auth/lib/authorization";
import { getSellerProductFormData } from "@/features/seller/services/product/get-product-form-data";
import { SellerProductForm } from "@/features/seller/forms/product/seller-product-form";

export const metadata: Metadata = {
  title: "Add New Product",
  description: "Create and publish a new product listing on UrbanClick.",
  robots: { index: false, follow: false },
};

export default async function NewSellerProductPage() {
  await requireSeller();

  const { categories, brands } = await getSellerProductFormData();

  return <SellerProductForm categories={categories} brands={brands} />;
}
