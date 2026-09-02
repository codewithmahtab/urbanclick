"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyUpdateEmailAction(_prevState: any, formData: FormData) {
  const otp = formData.get("otp") as string;

  if (!otp || otp.length !== 6) {
    return { error: "Please enter a valid 6-digit code." };
  }

  try {
    const session = await requireSession();

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, pendingEmail: true, otp: true, otpExpiresAt: true },
    });

    if (!user || !user.pendingEmail) {
      return { error: "No pending email update found." };
    }

    if (!user.otp || !user.otpExpiresAt) {
      return { error: "No verification code was requested. Please request a new one." };
    }

    if (new Date() > user.otpExpiresAt) {
      return { error: "Your verification code has expired. Please request a new one." };
    }

    if (user.otp !== otp) {
      return { error: "The code you entered is incorrect. Please try again." };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.pendingEmail,
        pendingEmail: null,
        otp: null,
        otpExpiresAt: null,
      },
    });

    revalidatePath("/account/security");
    return { success: true };
  } catch (error) {
    console.error("Verify update email error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
