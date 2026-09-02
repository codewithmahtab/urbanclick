export type FilterOption = {
  label: string;
  value: string;
  count: number;
};

export type ProductFilters = {
  categories: FilterOption[];
  brands: FilterOption[];
};

export type ProductQueryFilters = {
  page?: number;
  searchText?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};
