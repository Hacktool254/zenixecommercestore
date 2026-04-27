import type { Metadata } from "next";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export const metadata: Metadata = { title: "My Account — Zenix Electronics" };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:gap-10 md:px-6">
      <AccountSidebar />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
