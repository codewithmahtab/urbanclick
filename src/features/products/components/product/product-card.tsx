import { ProductCardType } from "@/features/products/types/products";
import { formatCurrency } from "@/utils/format";
import { ArrowRight, Star } from "lucide-react";
import { ProductImage } from "@/components/ui/product-image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ProductCardProps = {
  product: ProductCardType;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card key={product.id} className="pt-0 rounded-xl w-full group bg-background bg-card/30">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square w-full overflow-hidden rounded-t-xl p-4">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover p-4"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <CardContent className="space-y-2 mt-3 px-3">
          <h3 className="text-sm text-foreground font-medium truncate line-clamp-1">
            {product.name}
          </h3>

          <p className="font-medium text-2xl">
            {formatCurrency(product.priceInPaise)}
          </p>

          <div className="flex items-center justify-between gap-2 mt-4">
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                {product.averageRating}
                <Star className="size-3" fill="white" />
              </p>
              <span className="text-sm text-muted-foreground">{product.totalReviews} Reviews</span>
            </div>
            <Button className="rounded-full h-8 w-8 bg-primary text-primary-foreground group-hover:bg-primary/80">
              <ArrowRight />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
