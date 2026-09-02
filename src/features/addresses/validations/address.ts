import z from "zod";

export const AddressSchema = z.object({
  fullName: z
    .string()
    .min(2, { error: "Full name must be at least 2 characters" })
    .trim(),
  phone: z
    .string()
    .regex(/^(\+91[\s-]?|0)?[6-9]\d{9}$/, {
      error: "Please enter a valid 10-digit phone number",
    })
    .trim(),
  addressLine: z
    .string()
    .min(5, { error: "Address must be at least 5 characters" })
    .trim(),
  city: z.string().min(2, { error: "Please enter a valid city" }).trim(),
  state: z.string().min(2, { error: "Please enter a valid state" }).trim(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, { error: "PIN code must be exactly 6 digits" }),
  country: z.string().min(1, { error: "Country is required" }).trim(),
});

export type AddressFormState =
  | {
      fieldErrors?: {
        fullName?: string[];
        phone?: string[];
        addressLine?: string[];
        city?: string[];
        state?: string[];
        pincode?: string[];
        country?: string[];
      };
      formError?: string;
      success?: boolean;
    }
  | undefined;
