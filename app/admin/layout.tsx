"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Bell, Menu } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = useQuery(api.users.viewer);
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (viewer === undefined) return;
    if (isLoginPage) return;
    if (viewer === null || viewer.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [viewer, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (viewer === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c16]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }

  if (viewer === null || viewer.role !== "admin") return null;

  const initials = viewer.name
    ? viewer.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "A";

  return (
    <div className="flex min-h-screen bg-[#0a0e1a]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#f5a623]/10 bg-[#080c16] px-4 md:px-8">
          {/* Left: hamburger (mobile) + page context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f5a623]/10 text-[#8b92a5] transition hover:border-[#f5a623]/30 hover:text-[#f5a623] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="hidden items-center gap-3 md:flex">
              <div className="h-px w-6 bg-[#f5a623]/40" />
              <p className="text-[10px] font-black tracking-[0.3em] text-[#f5a623]/60 uppercase">
                Admin Console
              </p>
            </div>
          </div>

          {/* Right: status + bell + profile */}
          <div className="flex items-center gap-3">
            {/* System status */}
            <div className="hidden items-center gap-2 rounded-xl border border-[#f5a623]/10 bg-[#f5a623]/5 px-4 py-2 md:flex">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <p className="text-[10px] font-bold tracking-widest text-[#8b92a5] uppercase">
                Systems Active
              </p>
            </div>

            {/* Bell */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#f5a623]/10 bg-[#f5a623]/5 text-[#8b92a5] transition hover:border-[#f5a623]/30 hover:text-[#f5a623]">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#f5a623]" />
            </button>

            {/* Profile pill */}
            <div className="flex items-center gap-2.5 rounded-xl border border-[#f5a623]/10 bg-[#f5a623]/5 px-3 py-1.5">
              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg bg-[#f5a623]/20">
                {viewer.image ? (
                  <Image
                    src={viewer.image}
                    alt={viewer.name ?? "Admin"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-[10px] font-black text-[#f5a623]">{initials}</span>
                  </div>
                )}
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-[11px] leading-tight font-bold text-white">
                  {viewer.name ?? "Admin"}
                </span>
                <span className="text-[9px] font-bold tracking-widest text-[#f5a623]/50 uppercase">
                  Master Authority
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
