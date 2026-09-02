import AccountDropdown from "./account-dropdown";
import SellerLink from "./seller-link";
import { getCurrentUser } from "@/features/auth/lib/dal";
import { prisma } from "@/lib/prisma";

export default async function NavButtons() {
  const user = await getCurrentUser();
  let isSeller = false;

  if (user) {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id },
      select: { status: true },
    });
    isSeller = seller?.status === "APPROVED";
  }

  return (
    <>
      <SellerLink isSeller={isSeller} />
      <p className="h-10 w-px bg-white/20" />
      <AccountDropdown user={user} />
    </>
  );
}
