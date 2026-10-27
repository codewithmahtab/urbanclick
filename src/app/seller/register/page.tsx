export const instant = false;

import type { Metadata } from "next";
import { requireUser } from "@/features/auth/lib/dal";
import SellerRegisterForm from "@/features/seller/forms/register/seller-register-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Become a Seller",
  description: "Register as a seller on UrbanClick and start selling your products to millions of customers.",
  openGraph: {
    title: "Become a Seller on UrbanClick",
    description: "Set up your store and start selling today. Manage products, track orders, and grow your business.",
  },
};
import { redirect } from "next/navigation";
import PendingState from "@/features/seller/components/pending-state";
import SuspendedState from "@/features/seller/components/suspended-state";

export default async function SellerRegisterPage() {
  const user = await requireUser("/seller/register");

  const seller = await prisma.seller.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      status: true,
    },
  });

  if (seller?.status === "APPROVED") {
    redirect("/seller");
  }

  if (seller?.status === "PENDING") {
    return <PendingState />;
  }

  if (seller?.status === "SUSPENDED") {
    return <SuspendedState />;
  }

  return <SellerRegisterForm />;
}
