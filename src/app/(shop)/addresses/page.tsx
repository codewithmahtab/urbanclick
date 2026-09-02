export const instant = false;

import type { Metadata } from "next";
import { requireSession } from "@/features/auth/lib/dal";
import { getAddresses } from "@/features/addresses/services/get-addresses";
import AddressesView from "@/features/addresses/components/addresses-view";

export const metadata: Metadata = {
  title: "Your Addresses",
  description: "Manage your saved delivery addresses.",
  robots: { index: false, follow: false },
};

export default async function AddressesPage() {
  await requireSession("/addresses");

  const addresses = await getAddresses();

  return (
    <main className="min-h-screen bg-background py-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AddressesView addresses={addresses} />
      </div>
    </main>
  );
}
