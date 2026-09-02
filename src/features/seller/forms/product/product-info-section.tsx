import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Category = { id: string; name: string; slug: string };
type Brand = { id: string; name: string; slug: string };

type InitialData = {
  name: string;
  description: string | null;
  imageUrl: string;
  brandId: string | null;
  categories: { categoryId: string }[];
};

interface ProductInfoSectionProps {
  categories: Category[];
  brands: Brand[];
  initialData?: InitialData | null;
  errors?: {
    name?: string[];
    description?: string[];
    imageUrl?: string[];
    brandId?: string[];
    categoryIds?: string[];
  };
}

export function ProductInfoSection({
  categories,
  brands,
  initialData,
  errors,
}: ProductInfoSectionProps) {
  return (
    <section className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-medium tracking-tight">
          Product Information
        </h2>
        <p className="text-sm text-muted-foreground">
          Essential details about your product.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="e.g. Nike Air Max" 
            defaultValue={initialData?.name}
          />
          {errors?.name && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your product in detail..."
            className="min-h-[120px]"
            defaultValue={initialData?.description || ""}
          />
          {errors?.description && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.description[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://example.com/product.jpg"
            defaultValue={initialData?.imageUrl}
          />
          {errors?.imageUrl && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.imageUrl[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandId">Brand</Label>

          <select
            id="brandId"
            name="brandId"
            className="h-10 w-full max-w-40 cursor-pointer border border-input bg-muted px-3 py-2 text-sm disabled:opacity-50"
            defaultValue={initialData?.brandId || "none"}
          >
            <option value="none">No brand</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors?.brandId && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.brandId[0]}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Categories</Label>
          <div className="grid grid-cols-2 gap-4 rounded-md border p-4 sm:grid-cols-3">
            {categories.map((category) => {
              const isSelected = initialData?.categories?.some(
                (c) => c.categoryId === category.id
              );
              return (
                <div key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    name="categoryIds"
                    value={category.id}
                    className="h-5 w-5 cursor-pointer"
                    defaultChecked={isSelected}
                  />  
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal cursor-pointer leading-none"
                  >
                    {category.name}
                  </Label>
                </div>
              );
            })}
          </div>
          {errors?.categoryIds && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.categoryIds[0]}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
