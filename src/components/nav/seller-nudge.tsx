"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "seller_nudge_dismissed";
const NUDGE_COLOR = "#E63946";

export default function SellerNudge() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only on home page
    if (pathname !== "/") return;

    // Already dismissed permanently
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute top-full left-1/2 mt-3 z-50"
          style={{ translateX: "-50%" }}
        >
          {/* Upward triangle pointer — matches HoverDropdown pattern */}
          <div
            className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45"
            style={{ backgroundColor: NUDGE_COLOR }}
          />

          {/* Card */}
          <div
            className="relative rounded-none shadow-2xl px-4 py-3 flex items-center gap-3 whitespace-nowrap"
            style={{ backgroundColor: NUDGE_COLOR }}
          >
            <Link
              href="/seller/register"
              onClick={dismiss}
              className="text-sm font-medium text-white"
            >
              Become a Seller
            </Link>

            <button
              type="button"
              aria-label="Dismiss"
              onClick={dismiss}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
