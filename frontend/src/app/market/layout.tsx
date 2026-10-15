"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSubscription } from "@/hooks/useMarket";
import th from "@/locales/th.json";

const t = th.marketRadar;

const SUB_NAV = [
  { href: "/market", label: t.nav.overview },
  { href: "/market/compare", label: t.nav.compare },
  { href: "/market/chat", label: t.nav.chat },
  { href: "/market/plans", label: t.nav.plans },
];

/** Tab 2 shell: sub-menu, subscription banner, and the Premium lock
 * (mock-data/README.md: `is_premium` decides whether Tab 2 is locked). */
export default function MarketLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const subscription = useSubscription();
  const user = subscription.data?.current_user;
  const locked = user !== undefined && !user.is_premium && pathname !== "/market/plans";

  return (
    <div className="flex flex-col gap-[22px]">
      <header>
        <h1 className="text-2xl font-bold md:text-[30px]">{t.title}</h1>
        <p className="text-ink-muted">{t.subtitle}</p>
      </header>

      <nav aria-label={t.title} className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0">
        {SUB_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-[40px] flex-none items-center whitespace-nowrap rounded-[10px] px-3.5 text-sm ${
                active ? "bg-brand-soft font-semibold text-brand" : "font-medium text-ink-body hover:bg-[#EEF4FC] hover:text-brand"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user?.banner && (
        <div className="rounded-[10px] bg-brand-tint px-3.5 py-2.5 text-[13px] text-ink-body">{user.banner.message}</div>
      )}
      <div className="rounded-[10px] bg-[#FFF6E5] px-3.5 py-2.5 text-[13px] text-[#6B4E16]">{t.sampleNotice}</div>

      {locked ? (
        <section className="flex flex-col gap-2.5 rounded-2xl border-2 border-brand bg-brand-tint p-[22px]">
          <h2 className="text-[17px] font-semibold">{t.locked.title}</h2>
          <p className="text-sm text-ink-body">{t.locked.body}</p>
          <Link
            href="/market/plans"
            className="inline-flex min-h-[44px] items-center self-start rounded-full bg-brand px-[18px] text-sm font-semibold text-white"
          >
            {t.locked.cta}
          </Link>
        </section>
      ) : (
        children
      )}
    </div>
  );
}
