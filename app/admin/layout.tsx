"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = useQuery(api.users.viewer);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (viewer === undefined) return; // still loading
    if (isLoginPage) return; // don't redirect on the login page itself
    if (viewer === null || viewer.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [viewer, isLoginPage, router]);

  // On the login page — render without sidebar
  if (isLoginPage) return <>{children}</>;

  // Loading
  if (viewer === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c16]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }

  // Not admin — blank while redirect happens
  if (viewer === null || viewer.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-[#0a0e1a]">
      <AdminSidebar />
      <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
