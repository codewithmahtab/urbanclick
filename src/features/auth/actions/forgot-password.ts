"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import z from "zod";
import { getOtpEmailHtml } from "@/features/auth/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

const ForgotPasswordSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }).trim(),
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function forgotPasswordAction(
  _prevState: any,
  formData: FormData,
) {
  const emailData = formData.get("email");

  const validatedFields = ForgotPasswordSchema.safeParse({ email: emailData });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);
    return { fieldErrors };
  }

  const { email } = validatedFields.data;

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
        console.log(`[DEV MODE] Password Reset OTP for ${email} is ${otp}`);
      }
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return { formError: "Something went wrong. Please try again." };
  }

  redirect(`/forgot-password/verify?email=${encodeURIComponent(email)}&sent=true`);
}
