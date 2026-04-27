import type { Metadata } from "next";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { MobileAccountNav } from "@/components/account/MobileAccountNav";

export const metadata: Metadata = { title: "My Account — Zenix Electronics" };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080b14]">
      <div className="flex w-full flex-col md:flex-row md:items-start">
        {/* Sidebar: flush left, full height, sticky */}
        <div className="md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          <div className="px-3 py-10 md:py-12">
            <AccountSidebar />
          </div>
        </div>

        {/* Main content — extra bottom padding on mobile for the fixed nav bar */}
        <div className="flex min-w-0 flex-1 flex-col px-4 pt-6 pb-28 md:px-8 md:pt-12 md:pb-12">
          {children}
        </div>
      </div>

      {/* Mobile bottom nav bar */}
      <MobileAccountNav />
    </div>
  );
}
