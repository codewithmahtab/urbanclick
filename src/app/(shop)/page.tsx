import type { Metadata } from "next";
import CategoriesSection from "@/features/products/components/home/categories";
import HeroCarousel from "@/features/products/components/home/hero-carousel";
import { Suspense } from "react";
import { CategorySkeleton } from "@/components/skeleton/category-skeleton";

export const metadata: Metadata = {
  title: "Online Shopping for Electronics, Fashion, Home & More",
  description:
    "Shop from millions of products across electronics, fashion, home & kitchen, beauty, sports and more. Best prices, fast delivery, easy returns.",
  openGraph: {
    title: "Next Shop — Online Shopping for Electronics, Fashion & More",
    description:
      "Shop from millions of products. Best prices, fast delivery, easy returns.",
  },
};

export default async function HomePage() {
  return (
    <>
      <HeroCarousel />
      <Suspense fallback={<CategorySkeleton />}>
        <CategoriesSection />
      </Suspense>
    </>
  );
}
