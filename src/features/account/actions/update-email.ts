"use server";

import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import { UpdateEmailSchema } from "@/features/account/validations/security";
import { revalidatePath } from "next/cache";

import { getOtpEmailHtml } from "@/features/auth/lib/email-templates";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function updateEmailAction(_prevState: any, formData: FormData) {
  const emailData = formData.get("email");

  const validatedFields = UpdateEmailSchema.safeParse({ email: emailData });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return { fieldErrors };
  }

  const { email } = validatedFields.data;

  try {
    const session = await requireSession();

    // Check if email is already in use by another user
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser && existingUser.id !== session.userId) {
      return { fieldErrors: { email: ["This email is already in use by another account."] } };
    }

    if (existingUser && existingUser.id === session.userId) {
      return { fieldErrors: { email: ["This is already your current email address."] } };
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
      where: { id: session.userId },
      data: { 
        pendingEmail: email,
        otp,
        otpExpiresAt,
       },
    });

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "noreply@adowise.com",
        to: email,
        subject: "Verify your new email address",
        html: getOtpEmailHtml(otp, "verification"),
      });
    } else {
      console.log(`[DEV MODE] Email Change OTP for ${email} is ${otp}`);
    }

    return { requiresVerification: true };
  } catch (error) {
    console.error("Update email error:", error);
    return { formError: "Failed to update email. Please try again." };
  }
}
