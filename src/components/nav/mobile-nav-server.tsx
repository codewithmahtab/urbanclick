import { getCurrentUser } from "@/features/auth/lib/dal";
import { getCartCount } from "@/features/cart/services/get-cart-count";
import { prisma } from "@/lib/prisma";
import MobileNav from "./mobile-nav";

export default async function MobileNavServer() {
  const [user, cartCount] = await Promise.all([
    getCurrentUser(),
    getCartCount(),
  ]);

  let isSeller = false;
  if (user) {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id },
      select: { status: true },
    });
    isSeller = seller?.status === "APPROVED";
  }

  return <MobileNav user={user} isSeller={isSeller} cartCount={cartCount} />;
}
