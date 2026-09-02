import Link from "next/link";
import {
  Package,
  Shield,
  MapPin,
  Heart,
  Store,
  CreditCard,
  Headphones,
  LogOut,
} from "lucide-react";
import LogoutButton from "@/features/auth/components/logout-button";
import LoginLinks from "./login-links";
import { User } from "./account-dropdown";

const menuItems = [
  {
    title: "Your Account",
    href: "/account",
    icon: <Shield className="size-4" />,
  },
  {
    title: "Your Orders",
    href: "/orders",
    icon: <Package className="size-4" />,
  },
  {
    title: "Your Wishlist",
    href: "/wishlist",
    icon: <Heart className="size-4" />,
  },
  {
    title: "Your Addresses",
    href: "/addresses",
    icon: <MapPin className="size-4" />,
  },
  {
    title: "Your Seller Account",
    href: "/seller",
    icon: <Store className="size-4" />,
  },
  {
    title: "Payment Options",
    href: "/account/payments",
    icon: <CreditCard className="size-4" />,
  },
  {
    title: "Contact Us",
    href: "/contact",
    icon: <Headphones className="size-4" />,
  },
];

export default function DropdownContent({
  user,
}: {
  user: User | null;
}) {
  const renderLinks = () => (
    <ul className="flex flex-col mt-2">
      {menuItems.map((link) => (
        <li key={link.title}>
          <Link
            href={link.href}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-black/80 hover:text-black hover:bg-black/5 rounded-md transition-colors"
          >
            {link.icon}
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="w-72 bg-white p-3 shadow-2xl rounded-xl border border-black/10 text-black">
      {!user ? (
        <div>
        <LoginLinks />
          <div className="pt-2">{renderLinks()}</div>
        </div>
      ) : (
        <div>
          <div className="px-3 pb-3 pt-2 border-b border-black/10">
            <h3 className="font-semibold text-lg truncate">
              Hello, {user.name}
            </h3>
            <p className="text-xs text-black/60 truncate">{user.email}</p>
          </div>

          <div className="py-2 border-b border-black/10">{renderLinks()}</div>

          <div className="pt-2">
            <LogoutButton className="w-full text-left px-3 py-2.5 text-sm text-red-600 cursor-pointer rounded-md flex items-center gap-3 font-medium transition-colors">
              <LogOut className="size-4" />
              Sign Out
            </LogoutButton>
          </div>
        </div>
      )}
    </div>
  );
}
