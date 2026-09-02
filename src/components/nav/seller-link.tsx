import Link from "next/link";
import SellerNudge from "./seller-nudge";

export default function SellerLink({ isSeller }: { isSeller: boolean }) {
  const href = isSeller ? "/seller" : "/seller/register";
  const label = isSeller ? "Seller Dashboard" : "Become a Seller";

  return (
    <div className="relative">
      <Link
        href={href}
        className="flex h-12 items-center px-4 bg-background text-md font-light text-white"
      >
        {label}
      </Link>

      {!isSeller && <SellerNudge />}
    </div>
  );
}
