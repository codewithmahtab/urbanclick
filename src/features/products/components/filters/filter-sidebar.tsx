import { ProductFilters } from "@/features/products/types/filters";
import FilterSection from "./filter-section";
import PriceFilter from "./price-filter";

type FilterSidebarProps = {
  filters: ProductFilters;
  minPrice: number;
  maxPrice: number;
};

export default function FilterSidebar({
  filters,
  minPrice,
  maxPrice,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      <PriceFilter minPrice={minPrice} maxPrice={maxPrice} />
      
      <FilterSection
        title="Category"
        filterKey="category"
        options={filters.categories}
      />

      <FilterSection title="Brand" filterKey="brand" options={filters.brands} />
    </div>
  );
}
