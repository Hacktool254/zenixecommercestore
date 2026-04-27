"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, ShoppingBag, MapPin, Heart, LogOut, ArrowLeft } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Profile", href: "/account", icon: User, exact: true },
  { label: "My Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const viewer = useQuery(api.users.viewer);

  const initials = viewer?.name
    ? viewer.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <aside className="flex w-full shrink-0 flex-col md:w-64">
      {/* User card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        <div className="relative px-5 pt-6 pb-5">
          {/* Subtle gradient accent */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#f5a623]/6 to-transparent" />
          <div className="relative flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff9f1c] shadow-[0_0_24px_rgba(245,166,35,0.3)]">
              <span className="text-xl font-bold text-[#0a0e1a]">{initials}</span>
            </div>
            <p
              className="font-semibold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {viewer?.name ?? "Loading…"}
            </p>
            <p className="mt-0.5 text-xs text-[#8b92a5]">{viewer?.email ?? ""}</p>
            <span className="mt-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-[#f5a623] uppercase">
              {viewer?.role ?? "customer"}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mb-3 flex flex-row gap-1 overflow-x-auto rounded-2xl border border-[#1e2435] bg-[#0d1117] p-2 md:flex-col">
        {NAV.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all",
                active
                  ? "bg-[#f5a623]/10 text-[#f5a623] shadow-[inset_0_0_0_1px_rgba(245,166,35,0.2)]"
                  : "text-[#8b92a5] hover:bg-[#111827] hover:text-white"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                  active ? "bg-[#f5a623]/15" : "bg-[#1a2035]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="hidden md:inline">{label}</span>
              <span className="md:hidden">{label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="hidden flex-col gap-1 md:flex">
        <Link
          href="/shop"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8b92a5] transition hover:bg-[#111827] hover:text-white"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1a2035]">
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
          Continue Shopping
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8b92a5] transition hover:bg-[#1a2035] hover:text-red-400"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1a2035]">
            <LogOut className="h-3.5 w-3.5" />
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
