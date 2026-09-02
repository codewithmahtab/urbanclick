import z from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters long" }),

  email: z.email({ error: "Please enter a valid email address" }).trim(),

  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters long" }),

  confirmPassword: z
    .string()
    .min(6, { error: "Confirm Password must be at least 6 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type FormState =
  | {
      fieldErrors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      formError?: string;
    }
  | undefined;
