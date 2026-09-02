export const instant = false;

import { requireUser } from "@/features/auth/lib/dal";
import { UpdateNameForm } from "@/features/account/forms/update-name-form";
import { UpdateEmailForm } from "@/features/account/forms/update-email-form";
import { UpdatePasswordForm } from "@/features/account/forms/update-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login & Security",
  description: "Manage your personal information, email address, and account password.",
  robots: { index: false, follow: false },
};

export default async function SecurityPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto py-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8 mb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Login & Security</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal information and security settings.
        </p>
      </div>

      <div className="space-y-6">
        <UpdateNameForm currentName={user.name || ""} />
        <UpdateEmailForm currentEmail={user.email} />
        <UpdatePasswordForm />
      </div>
    </main>
  );
}
