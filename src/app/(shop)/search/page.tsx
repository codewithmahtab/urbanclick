export const instant = false;

import type { Metadata } from "next";
import FilterSidebar from "@/features/products/components/filters/filter-sidebar";
import Products from "@/features/products/components/product/products";
import SortSelect from "@/features/products/components/filters/sort-select";
import {
  getPriceRange,
  getProductCount,
  getProductFilters,
  getProducts,
  ITEMS_PER_PAGE,
} from "@/features/products/services/product/get-products";
import { buildProductFilters } from "@/features/products/utils/build-product-filters";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : "Search Products",
    description: q
      ? `Browse products matching "${q}" on Next Shop.`
      : "Search for products across all categories on Next Shop.",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);

  const searchText = params.q;
  const category = params.category;
  const brand = params.brand;
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const sort = params.sort;

  const [products, totalProducts, filterProducts, priceRange] =
    await Promise.all([
      getProducts({
        page,
        searchText,
        category,
        brand,
        minPrice,
        maxPrice,
        sort,
      }),
      getProductCount({
        searchText,
        category,
        brand,
        minPrice,
        maxPrice,
      }),
      getProductFilters({ searchText }),
      getPriceRange({
        searchText,
        category,
      }),
    ]);

  const filters = buildProductFilters(filterProducts);

  const minProductPrice = priceRange._min.priceInPaise ?? 0;
  const maxProductPrice = priceRange._max.priceInPaise ?? 0;

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const showFilters = filterProducts.length > 0;

  const range = `${(page - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(page * ITEMS_PER_PAGE, totalProducts)}`;

  return (
    <div className="flex w-full max-w-372 mx-auto relative">
      <aside className="hidden md:block border-r w-66 min-w-66 py-4 pr-4 min-h-screen">
        <h2 className="text-2xl font-medium">Filters</h2>

        {!showFilters ? (
          <p className="text-muted-foreground flex items-center justify-center h-50">
            No Filters
          </p>
        ) : (
          <FilterSidebar
            filters={filters}
            minPrice={minProductPrice}
            maxPrice={maxProductPrice}
          />
        )}
      </aside>

      <section className="w-full mb-10">
        <header className="border-b py-4 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">Products</h1>
            {products.length > 0 && (
              <p className="text-muted-foreground">
                Showing {range} of {totalProducts} results{" "}
                {searchText ? `for "${searchText}"` : ""}
              </p>
            )}
          </div>
          {products.length > 0 && <SortSelect />}
        </header>

        {products.length === 0 ? (
          <p className="text-muted-foreground flex items-center justify-center h-50">
            No Product Found
          </p>
        ) : (
          <Products products={products} totalPages={totalPages} />
        )}
      </section>
    </div>
  );
}
