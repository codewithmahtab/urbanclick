"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { redirect } from "next/navigation";
import { getOtpEmailHtml } from "@/features/auth/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function resendForgotPasswordOtpAction(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) {
      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: { otp, otpExpiresAt },
      });

      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "noreply@adowise.com",
          to: email,
          subject: "Reset your password",
          html: getOtpEmailHtml(otp, "reset"),
        });
      } else {
        console.log(`[DEV MODE] Resent Password Reset OTP for ${email} is ${otp}`);
      }
    }
  } catch (error) {
    console.error("Resend Forgot Password OTP error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  // Redirect to append ?sent=true so the client timer starts
  redirect(`/forgot-password/verify?email=${encodeURIComponent(email)}&sent=true`);
}
