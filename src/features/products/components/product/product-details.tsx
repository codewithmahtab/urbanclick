import { StarRating } from "@/features/products/components/product/star-rating";
import { ProductDetailType } from "@/features/products/types/products";
import { formatCurrency } from "@/utils/format";
import { Check } from "lucide-react";
import { ProductImage } from "@/components/ui/product-image";
import ProductPurchaseForm from "../forms/product-purchase-form";
import WishlistButton from "./wishlist-button";
import ReviewsSection from "@/features/reviews/components/reviews-section";
import { Suspense } from "react";

type ProductDetailsProps = {
  product: ProductDetailType;
  isWishlisted: boolean;
};

export default function ProductDetails({
  product,
  isWishlisted,
}: ProductDetailsProps) {
  return (
    <main className="min-h-screen bg-background relative">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="mx-auto w-full max-w-md flex flex-col gap-2">
            <div className="absolute top-4 left-4 z-10">
              <WishlistButton
                product={product}
                initialIsWishlisted={isWishlisted}
              />
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {product.brand && (
                <>
                  <span className="text-sm font-medium text-muted-foreground">
                    {product.brand.name}
                  </span>
                  <span className="text-muted-foreground">•</span>
                </>
              )}

              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                {product.seller.storeName}
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StarRating rating={product.averageRating} size={32} />

              <span className="text-2xl font-semibold">
                {product.averageRating}
              </span>
              <span className="text-muted-foreground">•</span>

              <span className="text-md text-muted-foreground">
                {product.totalReviews} reviews
              </span>
            </div>

            <p className="mt-6 leading-7 text-muted-foreground">
              {product.description}
            </p>

            <p className="text-3xl font-bold tracking-tight mt-6">
              {formatCurrency(product.priceInPaise)}
            </p>

            <div className="mt-5">
              <p
                className={`flex items-center gap-2 text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-destructive"}`}
              >
                {product.stock > 0 && <Check size={16} />}
                {product.stock > 0
                  ? "In stock and ready to ship"
                  : "Out of stock"}
              </p>
            </div>

            <ProductPurchaseForm
              product={{ ...product, stock: product.stock }}
            />
          </div>
        </section>

        <Suspense fallback={<div className="mt-16 h-40 animate-pulse bg-muted rounded-xl" />}>
          <ReviewsSection productId={product.id} />
        </Suspense>
      </div>
    </main>
  );
}
