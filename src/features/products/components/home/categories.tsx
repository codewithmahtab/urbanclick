import { ProductImage } from "@/components/ui/product-image";
import Link from "next/link";
import { getFeaturedCategoriesWithProducts } from "@/features/products/services/category.service";
import { ChevronRight } from "lucide-react";

export default async function CategoriesSection() {
  const categories = await getFeaturedCategoriesWithProducts();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-4 pb-8 px-4 w-full max-w-400 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="bg-card p-5 pt-4 rounded-none border border-border flex flex-col h-full group/card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                {category.name}
              </h2>
              <ChevronRight className="size-8 text-muted-foreground group-hover/card:text-primary transition-colors" />
            </div>

            {category.products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 mb-4 flex-grow">
                {category.products.map(({ product }) => (
                  <div key={product.id} className="flex flex-col">
                    <div className="relative aspect-square w-full rounded-md overflow-hidden bg-muted mb-2">
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 w-full">
                      {product.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center bg-muted/30 rounded-md mb-4 min-h-[200px]">
                <p className="text-sm text-muted-foreground">No products yet</p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
