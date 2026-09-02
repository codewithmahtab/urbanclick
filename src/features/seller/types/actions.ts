export interface CreateProductState {
  formError?: string;
  fieldErrors?: {
    name?: string[];
    description?: string[];
    imageUrl?: string[];
    brandId?: string[];
    categoryIds?: string[];
    price?: string[];
    stock?: string[];
  };
}
