"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import th from "@/locales/th.json";

const TABS = [
  {
    href: "/",
    label: th.tabs.myBusiness,
    matches: ["/", "/transactions", "/stock"],
    icon: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </>
    ),
  },
  {
    href: "/market",
    label: th.tabs.marketRadar,
    matches: ["/market"],
    icon: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  },
];

function TabIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function useActiveTab() {
  const pathname = usePathname();
  return (tab: (typeof TABS)[number]) =>
    tab.matches.some((m) => pathname === m || (m !== "/" && pathname.startsWith(`${m}/`)));
}

/** Top bar: logo everywhere, nav links on desktop (mobile uses the bottom NavTabs). */
export function SiteHeader() {
  const isActive = useActiveTab();

  return (
    <div className="border-b border-[#E6EBF2] bg-white">
      <header className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-5">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-navy md:text-xl">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="14" stroke="#1F5FBF" strokeWidth="2.5" />
            <circle cx="16" cy="16" r="8" stroke="#6FA8DC" strokeWidth="2.5" />
            <path d="M16 16L26 6" stroke="#1F5FBF" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="16" r="2.5" fill="#1F5FBF" />
          </svg>
          U-Ledger AI
        </Link>
        <nav aria-label="เมนูหลัก" className="hidden items-center gap-1 md:flex">
          {TABS.map((tab) => {
            const active = isActive(tab);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-[10px] px-3.5 ${
                  active
                    ? "bg-brand-soft font-semibold text-brand"
                    : "font-medium text-ink-body hover:bg-[#EEF4FC] hover:text-brand"
                }`}
              >
                <TabIcon>{tab.icon}</TabIcon>
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div
        aria-hidden="true"
        className="h-2 bg-[repeating-linear-gradient(90deg,#1F5FBF_0_40px,#DCE8F7_40px_80px)]"
      />
    </div>
  );
}

/** Bottom tab bar, mobile only. */
export function NavTabs() {
  const isActive = useActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex border-t border-line bg-white md:hidden">
      {TABS.map((tab) => {
        const active = isActive(tab);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs ${
              active ? "font-semibold text-brand" : "text-ink-muted"
            }`}
          >
            <TabIcon>{tab.icon}</TabIcon>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
