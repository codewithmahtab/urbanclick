export const instant = false;

import type { Metadata } from "next";
import VerifyEmailForm from "@/features/auth/forms/verify-email-form";
import { getCurrentUser } from "@/features/auth/lib/dal";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your UrbanClick account.",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage() {
  const user = await getCurrentUser();

  if (user && user.isVerified) {
    redirect("/");
  }

  return <VerifyEmailForm email={user?.email || ""} />;
}
