"use client";
import { useNavigation } from "@/providers/navigation-provider";
import { ProductCardType } from "@/features/products/types/products";
import LoadingSpinner from "@/components/common/loading-spinner";
import Pagination from "./pagination";
import ProductGrid from "./product-grid";

type ProductsProps = {
  products: ProductCardType[];
  totalPages: number;
};

export default function Products({ products, totalPages }: ProductsProps) {
  const { isNavigating } = useNavigation();

  return (
    <>
      <ProductGrid products={products} />

      {totalPages > 1 && <Pagination totalPages={totalPages} />}

      {isNavigating && <LoadingSpinner />}
    </>
  );
}
