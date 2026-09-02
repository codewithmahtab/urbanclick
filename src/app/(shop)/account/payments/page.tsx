export const instant = false;

import type { Metadata } from "next";
import { requireSession } from "@/features/auth/lib/dal";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment Options",
  description: "Manage your saved cards and payment methods.",
  robots: { index: false, follow: false },
};

export default async function PaymentsPage() {
  await requireSession();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Payment Options</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your cards and other payment methods.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-white/10 rounded-2xl bg-white/5">
          <div className="bg-white/10 p-4 rounded-full mb-6">
            <CreditCard className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            We are working hard to bring you a seamless payment management experience. Stay tuned!
          </p>
          <Link href="/account">
            <Button className="h-12 px-8">Back to Account</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
