"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, MapPin, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/account", icon: LayoutDashboard, exact: true },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export function MobileAccountNav() {
  const pathname = usePathname();

  return (
    <nav className="pb-safe fixed right-0 bottom-0 left-0 z-40 flex items-center justify-around border-t border-[#1e2435] bg-[#080b14]/95 px-2 pt-2 backdrop-blur-xl md:hidden">
      {NAV.map(({ label, href, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors"
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                active
                  ? "bg-[#f5a623]/15 shadow-[inset_0_0_0_1px_rgba(245,166,35,0.25)]"
                  : "bg-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  active ? "text-[#f5a623]" : "text-[#4b5563]"
                )}
              />
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold tracking-wide transition-colors",
                active ? "text-[#f5a623]" : "text-[#4b5563]"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
