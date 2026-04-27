import type { Metadata } from "next";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export const metadata: Metadata = { title: "My Account — Zenix Electronics" };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080b14]">
      <div className="flex w-full flex-col md:flex-row md:items-start">
        {/* Sidebar: flush left, full height */}
        <div className="md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          <div className="px-3 py-10 md:py-12">
            <AccountSidebar />
          </div>
        </div>
        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col px-4 py-10 md:px-8 md:py-12">{children}</div>
      </div>
    </div>
  );
}
