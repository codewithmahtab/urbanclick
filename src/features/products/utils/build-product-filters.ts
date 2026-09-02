import { FilterOption, ProductFilters } from "@/features/products/types/filters";

type FilterProduct = {
  brand: {
    slug: string;
    name: string;
  } | null;

  categories: {
    category: {
      slug: string;
      name: string;
    };
  }[];

};

export function buildProductFilters(products: FilterProduct[]): ProductFilters {
  const categories: {
    value: string;
    label: string;
  }[] = [];

  const brands: {
    value: string;
    label: string;
  }[] = [];

  for (const product of products) {
    if (product.brand) {
      brands.push({
        value: product.brand.slug,
        label: product.brand.name,
      });
    }

    for (const productCategory of product.categories) {
      categories.push({
        value: productCategory.category.slug,
        label: productCategory.category.name,
      });
    }
  }

  return {
    categories: countOptions(categories),
    brands: countOptions(brands),
  };
}

function countOptions(
  values: { value: string; label: string }[],
): FilterOption[] {
  const counts = new Map<
    string,
    {
      label: string;
      count: number;
    }
  >();

  for (const item of values) {
    const existing = counts.get(item.value);

    if (existing) {
      existing.count += 1;
    } else {
      counts.set(item.value, {
        label: item.label,
        count: 1,
      });
    }
  }

  return Array.from(counts.entries())
    .map(([value, data]) => ({
      value,
      label: data.label,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count);
}
