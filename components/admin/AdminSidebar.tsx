"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Warehouse,
  Users,
  ArrowLeft,
  LogOut,
  Zap,
  X,
  Settings,
} from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-[#f5a623]/10 bg-[#080c16] transition-transform duration-300 lg:static lg:z-auto lg:h-full lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-[72px] items-center justify-between border-b border-[#f5a623]/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5a623]/10">
              <Zap className="h-4 w-4 text-[#f5a623]" />
            </div>
            <div>
              <p className="text-[11px] font-black tracking-[0.25em] text-[#f5a623] uppercase">
                Zenix
              </p>
              <p className="text-[9px] font-bold tracking-[0.2em] text-[#f5a623]/40 uppercase">
                Admin Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8b92a5] transition hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav label */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[9px] font-black tracking-[0.3em] text-[#f5a623]/30 uppercase">
            Navigation
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {NAV.map(({ label, href, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                  active
                    ? "bg-[#f5a623]/10 text-[#f5a623]"
                    : "text-[#8b92a5] hover:bg-[#f5a623]/5 hover:text-white"
                )}
              >
                {active && (
                  <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[#f5a623]" />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-[#f5a623]" : "text-[#8b92a5] group-hover:text-white"
                  )}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-0.5 border-t border-[#f5a623]/10 p-3">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#8b92a5] transition hover:bg-[#f5a623]/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            Back to Store
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#8b92a5] transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
