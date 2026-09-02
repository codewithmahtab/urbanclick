import z from "zod";

export const SellerRegisterSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(2, { error: "Store name must be at least 2 characters long" }),

  description: z
    .string()
    .trim()
    .max(500, { error: "Description cannot exceed 500 characters" })
    .optional(),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, {
      error: "Please enter a valid 10-digit phone number",
    }),

  addressLine: z
    .string()
    .trim()
    .min(5, { error: "Address must be at least 5 characters long" }),

  city: z.string().trim().min(2, { error: "City is required" }),

  state: z.string().trim().min(2, { error: "State is required" }),

  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, {
      error: "Please enter a valid 6-digit pincode",
    }),

  gstin: z.string().trim().optional(),

  pan: z
    .string()
    .trim()
    .toUpperCase()
    .refine((val) => val === "" || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(val), {
      message: "Please enter a valid PAN number",
    })
    .optional(),
});

export type SellerRegisterFormState =
  | {
      fieldErrors?: {
        storeName?: string[];
        description?: string[];
        phone?: string[];
        addressLine?: string[];
        city?: string[];
        state?: string[];
        pincode?: string[];
        gstin?: string[];
        pan?: string[];
      };
      formError?: string;
    }
  | undefined;
