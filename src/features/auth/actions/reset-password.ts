"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import z from "zod";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { error: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { error: "Confirm Password must be at least 6 characters long" }),
    token: z.string().min(1, { error: "Reset token is missing" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function resetPasswordAction(_prevState: any, formData: FormData) {
  const validateFields = ResetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    token: formData.get("token"),
  });

  if (!validateFields.success) {
    const { fieldErrors } = z.flattenError(validateFields.error);
    return { fieldErrors };
  }

  const { password, token } = validateFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
      select: { id: true, resetTokenExpiresAt: true },
    });

    if (!user || !user.resetTokenExpiresAt) {
      return { formError: "Invalid or expired reset token." };
    }

    if (user.resetTokenExpiresAt < new Date()) {
      return { formError: "Reset token has expired. Please request a new one." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return { formError: "Something went wrong. Please try again." };
  }

  redirect("/login?resetSuccess=true");
}
