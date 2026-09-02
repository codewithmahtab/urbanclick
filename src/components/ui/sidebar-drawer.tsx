"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

interface SidebarDrawerProps {
  children: React.ReactNode;
}

export function SidebarDrawer({ children }: SidebarDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
        className="fixed top-3 left-3 z-40 flex md:hidden items-center justify-center h-9 w-9 rounded-md bg-card border border-white/10 text-foreground shadow-md"
      >
        <Menu className="size-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={[
          "md:relative md:translate-x-0 md:flex md:flex-col md:w-64 md:shrink-0 md:border-r md:bg-card md:sticky md:top-0 md:h-screen md:overflow-y-auto",
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-white/10 flex flex-col",
          "transition-transform duration-300 ease-in-out md:transition-none",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 flex md:hidden items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:bg-white/10 transition-colors"
        >
          <X className="size-4" />
        </button>

        {children}
      </aside>
    </>
  );
}
