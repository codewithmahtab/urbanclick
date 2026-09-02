export const instant = false;

import type { Metadata } from "next";
import VerifyForgotPasswordForm from "@/features/auth/forms/verify-forgot-password-form";
import { getCurrentUser } from "@/features/auth/lib/dal";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify OTP",
  description: "Enter the OTP sent to your email to reset your password.",
  robots: { index: false, follow: false },
};

export default async function VerifyForgotPasswordPage() {
  const user = await getCurrentUser();

  if (user && user.isVerified) {
    redirect("/");
  }

  return <VerifyForgotPasswordForm />;
}
