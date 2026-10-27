export const instant = false;

import type { Metadata } from "next";
import ResetPasswordForm from "@/features/auth/forms/reset-password-form";
import { getCurrentUser } from "@/features/auth/lib/dal";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your UrbanClick account.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();

  if (user && user.isVerified) {
    redirect("/");
  }

  return <ResetPasswordForm />;
}
