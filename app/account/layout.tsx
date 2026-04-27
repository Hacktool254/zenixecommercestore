import type { Metadata } from "next";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export const metadata: Metadata = { title: "My Account — Zenix Electronics" };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080b14]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:gap-7 md:px-6 md:py-12">
        <AccountSidebar />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
