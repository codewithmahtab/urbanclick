"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function verifyForgotPasswordOtpAction(_prevState: any, formData: FormData) {
  const otp = formData.get("otp") as string;
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Missing email address." };
  }

  if (!otp || otp.length !== 6) {
    return { error: "Please enter a valid 6-digit OTP." };
  }

  let resetToken = "";

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, otp: true, otpExpiresAt: true },
    });

    if (!user) {
      return { error: "We couldn't find an account associated with this request." };
    }

    if (!user.otp || !user.otpExpiresAt) {
      return { error: "No OTP request found. Please request a new one." };
    }

    if (user.otpExpiresAt < new Date()) {
      return { error: "OTP has expired. Please request a new one." };
    }

    if (user.otp !== otp) {
      return { error: "Invalid OTP. Please try again." };
    }

    resetToken = crypto.randomUUID();
    const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiresAt: null,
        resetToken,
        resetTokenExpiresAt,
      },
    });
  } catch (error) {
    console.error("Forgot password OTP verification error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect(`/reset-password?token=${encodeURIComponent(resetToken)}`);
}
