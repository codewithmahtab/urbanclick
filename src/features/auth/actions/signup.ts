"use server";

import { createSession } from "@/features/auth/lib/session";
import { prisma } from "@/lib/prisma";
import {
  FormState,
  SignupFormSchema,
} from "@/features/auth/validations/signup";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import z from "zod";

import { Resend } from "resend";

import { getOtpEmailHtml } from "@/features/auth/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function signup(_prevState: FormState, formData: FormData) {
  const validateFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validateFields.success) {
    const { fieldErrors } = z.flattenError(validateFields.error);

    return {
      fieldErrors: fieldErrors,
    };
  }

  const { name, email, password } = validateFields.data;

  const redirectTo = formData.get("redirectTo")?.toString() || "/";

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return {
        formError: "An account with this email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        otp,
        otpExpiresAt,
      },
      select: {
        id: true,
      },
    });

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "noreply@adowise.com",
        to: email,
        subject: "Verify your email",
        html: getOtpEmailHtml(otp, "verification"),
      });
    } else {
      console.log(`[DEV MODE] OTP for ${email} is ${otp}`);
    }

    await createSession(user.id, false);
  } catch (error) {
    console.log(error);

    return {
      formError: "Something went wrong. Please try again later",
    };
  }

  redirect(`/verify-email?sent=true&redirectTo=${encodeURIComponent(redirectTo)}`);
}
