import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { WhatsAppFAB } from "@/components/shared/WhatsAppFAB";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col pt-[72px] pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <WhatsAppFAB />
    </>
  );
}
