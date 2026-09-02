import z from "zod";

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }).trim(),

  password: z.string().min(1, { error: "Please enter your password" }),
});

export type FormState =
  | {
      fieldErrors?: {
        email?: string[];
        password?: string[];
      };
      formError?: string;
    }
  | undefined;
