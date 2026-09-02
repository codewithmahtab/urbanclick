export const instant = false;

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/dal";
import SignupForm from "@/features/auth/forms/signup-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free Next Shop account to start shopping, save items, and track your orders.",
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <SignupForm />;
}
