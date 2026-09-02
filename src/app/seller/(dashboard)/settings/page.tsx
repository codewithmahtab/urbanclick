export const instant = false;

import { requireSeller } from "@/features/auth/lib/authorization";
import { getSellerProfile } from "@/features/seller/services/get-seller-profile";
import { SellerSettingsForm } from "@/features/seller/forms/settings/seller-settings-form";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your store profile, business details, and account preferences.",
  robots: { index: false, follow: false },
};

export default async function SellerSettingsPage() {
  const seller = await requireSeller();
  const profile = await getSellerProfile(seller.id);

  if (!profile) notFound();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your store profile and business details.
        </p>
      </div>
      <SellerSettingsForm seller={profile} />
    </div>
  );
}
