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
import { getCategoryBySlug, getCategories } from "@/features/products/services/category.service";
import { notFound } from "next/navigation";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} — Shop Online`,
    description: `Browse the best ${category.name} products on Next Shop. Great prices, fast delivery.`,
    openGraph: {
      title: `${category.name} | Next Shop`,
      description: `Explore our ${category.name} collection with great deals and fast delivery.`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categoryData = await getCategoryBySlug(resolvedParams.slug);

  if (!categoryData) {
    notFound();
  }

  const page = Math.max(Number(resolvedSearchParams.page) || 1, 1);
  const category = resolvedParams.slug;
  const brand = resolvedSearchParams.brand;
  const minPrice = resolvedSearchParams.minPrice;
  const maxPrice = resolvedSearchParams.maxPrice;
  const sort = resolvedSearchParams.sort;

  const [products, totalProducts, filterProducts, priceRange] =
    await Promise.all([
      getProducts({ page, category, brand, minPrice, maxPrice, sort }),
      getProductCount({ category, brand, minPrice, maxPrice }),
      getProductFilters({ category }),
      getPriceRange({ category }),
    ]);

  const filters = buildProductFilters(filterProducts);
  const categoryFilters = { ...filters, categories: [] };
  const minProductPrice = priceRange._min.priceInPaise ?? 0;
  const maxProductPrice = priceRange._max.priceInPaise ?? 0;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const showFilters = categoryFilters.brands.length > 0;
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
            filters={categoryFilters}
            minPrice={minProductPrice}
            maxPrice={maxProductPrice}
          />
        )}
      </aside>

      <section className="w-full mb-10">
        <header className="border-b py-4 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">{categoryData.name}</h1>
            {products.length > 0 && (
              <p className="text-muted-foreground mt-1">
                Showing {range} of {totalProducts} products
              </p>
            )}
          </div>
          {products.length > 0 && <SortSelect />}
        </header>

        {products.length === 0 ? (
          <p className="text-muted-foreground flex items-center justify-center h-50">
            No products found in this category.
          </p>
        ) : (
          <Products products={products} totalPages={totalPages} />
        )}
      </section>
    </div>
  );
}
