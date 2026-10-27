export const instant = false;

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/dal";
import LoginForm from "@/features/auth/forms/login-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your UrbanClick account to shop, track orders, and manage your account.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <LoginForm />;
}
