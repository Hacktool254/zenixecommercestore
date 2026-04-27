import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0e1a] px-4 py-12">
      <Link href="/" className="mb-8">
        <Image
          src="/logo.png"
          alt="Zenix Electronics"
          width={120}
          height={40}
          className="h-10 w-auto object-contain"
          priority
        />
      </Link>
      <div className="w-full max-w-md rounded-xl border border-[#1e2435] bg-[#0d1117] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {children}
      </div>
    </div>
  );
}
