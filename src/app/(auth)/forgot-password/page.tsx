export const instant = false;

import type { Metadata } from "next";
import ForgotPasswordForm from "@/features/auth/forms/forgot-password-form";
import { getCurrentUser } from "@/features/auth/lib/dal";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Next Shop account password.",
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();

  if (user && user.isVerified) {
    redirect("/");
  }

  return <ForgotPasswordForm />;
}
