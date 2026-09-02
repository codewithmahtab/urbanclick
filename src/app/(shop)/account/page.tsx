export const instant = false;

import type { Metadata } from "next";
import { accountItems } from "@/features/account/constants";
import { requireSession } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Manage your orders, addresses, payments, and account settings.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const { userId } = await requireSession();

  const seller = await prisma.seller.findUnique({
    where: { userId },
    select: { status: true },
  });
  const isSeller = seller?.status === "APPROVED";

  return (
    <main className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold sm:text-3xl">Your Account</h1>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {accountItems.map((item) => {
          let href = item.href;
          if (item.title === "Your Seller Account") {
            href = isSeller ? "/seller" : "/seller/register";
          }

          return (
            <li key={item.title}>
              <Link
                href={href}
                className="flex min-h-28 items-start gap-3 rounded-lg h-34 bg-white/5 p-5 hover:bg-white/10"
              >
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-medium">{item.title}</h2>

                  <p className="mt-1 text-sm leading-5 text-gray-400">
                    {item.description}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
