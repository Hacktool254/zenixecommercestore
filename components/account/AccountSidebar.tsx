"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/account", icon: LayoutDashboard, exact: true },
  { label: "My Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const viewer = useQuery(api.users.viewer);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (viewer?.role === "admin") {
      router.replace("/admin");
    }
  }, [viewer, router]);

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
    <aside
      className={cn(
        "relative hidden shrink-0 flex-col transition-all duration-300 md:flex",
        collapsed ? "w-[68px]" : "w-60"
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute top-6 -right-3 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-[#1e2435] bg-[#0d1117] text-[#8b92a5] shadow-md transition hover:border-[#f5a623]/40 hover:text-[#f5a623]"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* User card */}
      <div
        className={cn(
          "mb-4 overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117] transition-all duration-300",
          collapsed ? "px-2 py-4" : ""
        )}
      >
        <div className={cn("relative", collapsed ? "" : "px-5 pt-6 pb-5")}>
          {!collapsed && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#f5a623]/6 to-transparent" />
          )}
          <div className="relative flex flex-col items-center text-center">
            {/* Avatar */}
            <div
              className={cn(
                "relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff9f1c] shadow-[0_0_24px_rgba(245,166,35,0.25)]",
                collapsed ? "h-10 w-10 rounded-xl" : "mb-3 h-16 w-16"
              )}
            >
              {viewer?.image ? (
                <Image
                  src={viewer.image}
                  alt={viewer.name ?? "avatar"}
                  fill
                  className="object-cover"
                  sizes={collapsed ? "40px" : "64px"}
                />
              ) : (
                <span className={cn("font-bold text-[#0a0e1a]", collapsed ? "text-sm" : "text-xl")}>
                  {initials}
                </span>
              )}
            </div>
            {!collapsed && (
              <>
                <p
                  className="font-semibold text-white"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {viewer?.name ?? "—"}
                </p>
                <p className="mt-0.5 text-xs text-[#8b92a5]">{viewer?.email ?? ""}</p>
                <span className="mt-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-[#f5a623] uppercase">
                  {viewer?.role ?? "customer"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mb-3 flex flex-col gap-1 rounded-2xl border border-[#1e2435] bg-[#0d1117] p-2">
        {NAV.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                collapsed && "justify-center px-2",
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
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="flex flex-col gap-1">
        <Link
          href="/shop"
          title={collapsed ? "Continue Shopping" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8b92a5] transition hover:bg-[#111827] hover:text-white",
            collapsed && "justify-center px-2"
          )}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1a2035]">
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
          {!collapsed && <span>Continue Shopping</span>}
        </Link>
        <button
          onClick={handleSignOut}
          title={collapsed ? "Sign Out" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8b92a5] transition hover:bg-[#1a2035] hover:text-red-400",
            collapsed && "justify-center px-2"
          )}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1a2035]">
            <LogOut className="h-3.5 w-3.5" />
          </span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
