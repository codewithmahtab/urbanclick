import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  imageUrl: z.string().url("Please provide a valid URL for the image"),
  brandId: z
    .string()
    .optional()
    .transform((val) => (val === "none" ? undefined : val)),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
});
