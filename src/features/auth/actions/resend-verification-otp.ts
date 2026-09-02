"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { redirect } from "next/navigation";
import { getOtpEmailHtml } from "@/features/auth/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function resendVerificationOtpAction() {
  let email = "";
  try {
    const session = await requireSession();
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, isVerified: true },
    });

    if (!user || user.isVerified) {
      return { error: "Your account is already verified or couldn't be found." };
    }

    email = user.email;
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
        subject: "Verify your email",
        html: getOtpEmailHtml(otp, "verification"),
      });
    } else {
      console.log(`[DEV MODE] Resent OTP for ${email} is ${otp}`);
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  // Redirect to append ?sent=true so the client timer starts
  redirect("/verify-email?sent=true");
}
