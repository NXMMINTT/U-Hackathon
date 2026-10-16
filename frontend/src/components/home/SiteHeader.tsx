import Link from "next/link";

import { Logo } from "@/components/brand/Logo";

const NAV = [
  { href: "#ledger", label: "จดบัญชี" },
  { href: "#tax", label: "ภาษี" },
  { href: "#radar", label: "ส่องคู่แข่ง" },
  { href: "#pricing", label: "ราคา" },
  { href: "#faq", label: "ถามบ่อย" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-white/95 shadow-[0_1px_0_#E6EEF9] backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Logo />
        <nav aria-label="เมนูหลัก" className="hidden flex-wrap text-base lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="inline-flex min-h-[44px] items-center px-3.5 font-medium text-ink-body no-underline hover:text-brand">
              {n.label}
            </a>
          ))}
        </nav>
        <Link href="/dashboard" className="inline-flex min-h-[44px] items-center rounded-full bg-brand px-6 font-bold text-white no-underline hover:bg-brand-dark">
          เข้าใช้งาน
        </Link>
      </div>
    </header>
  );
}
