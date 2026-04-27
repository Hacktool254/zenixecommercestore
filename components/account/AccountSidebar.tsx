"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, ShoppingBag, MapPin, Heart, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Profile", href: "/account", icon: User, exact: true },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <aside className="w-full shrink-0 md:w-56">
      <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
        {NAV.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                active
                  ? "bg-[#f5a623]/10 text-[#f5a623]"
                  : "text-[#8b92a5] hover:bg-[#1a2035] hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 hidden border-t border-[#1e2435] pt-4 md:block">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#8b92a5] transition-colors hover:bg-[#1a2035] hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
