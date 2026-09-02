"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createToken, verifyToken } from "@/features/auth/lib/token";
import { getCookie, setCookie } from "@/features/auth/lib/cookie";

export async function verifyOtpAction(_prevState: any, formData: FormData) {
  const otp = formData.get("otp") as string;
  const redirectTo = formData.get("redirectTo")?.toString() || "/";

  if (!otp || otp.length !== 6) {
    return { error: "Please enter a valid 6-digit OTP." };
  }

  try {
    const session = await requireSession(redirectTo);

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, otp: true, otpExpiresAt: true },
    });

    if (!user) {
      return { error: "We couldn't find your account. Please log in again." };
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

    // Mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    // Update the session token to include isVerified: true
    const cookie = await getCookie();
    if (cookie) {
      const payload = await verifyToken(cookie);
      if (payload && payload.sessionId) {
        const newCookie = await createToken({
          sessionId: payload.sessionId,
          isVerified: true,
        });
        await setCookie(newCookie, payload.expiresAt);
      }
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect(redirectTo);
}
