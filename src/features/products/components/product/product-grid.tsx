import { ProductCardType } from "@/features/products/types/products";
import ProductCard from "./product-card";

type ProductGridProps = {
  products: ProductCardType[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
