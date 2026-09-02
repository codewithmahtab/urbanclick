import z from "zod";

export const UpdateNameSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
});

export const UpdateEmailSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }).trim(),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required." }),
    newPassword: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required." })
      .trim(),
  })
  .superRefine((val, ctx) => {
    if (val.newPassword !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
