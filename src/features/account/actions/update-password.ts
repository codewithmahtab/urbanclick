"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { UpdatePasswordSchema } from "@/features/account/validations/security";
import bcrypt from "bcrypt";

export async function updatePasswordAction(_prevState: any, formData: FormData) {
  const currentPasswordData = formData.get("currentPassword");
  const newPasswordData = formData.get("newPassword");
  const confirmPasswordData = formData.get("confirmPassword");

  const validatedFields = UpdatePasswordSchema.safeParse({
    currentPassword: currentPasswordData,
    newPassword: newPasswordData,
    confirmPassword: confirmPasswordData,
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return { fieldErrors };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const session = await requireSession();

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { password: true },
    });

    if (!user) {
      return { formError: "User not found." };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return { fieldErrors: { currentPassword: ["Incorrect current password."] } };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedNewPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Update password error:", error);
    return { formError: "Failed to update password. Please try again." };
  }
}
