"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PlatformBadge } from "@/components/market/PlatformBadge";
import { useSubscription, useTrendCatalog } from "@/hooks/useMarket";
import th from "@/locales/th.json";

const t = th.welcome;
const HERO_PRODUCT = "หูฟังไร้สายตัดเสียงรบกวน";

function SectionTag({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-xs font-semibold tracking-widest text-brand">[{children}]</span>;
}

/** Landing page ported from NIGHT's index.html; prices and plans come from the mock-data API. */
export default function WelcomePage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const catalog = useTrendCatalog();
  const subscription = useSubscription();

  const hero = catalog.data?.products.find((p) => p.name === HERO_PRODUCT);
  const heroOffers = (hero?.offers ?? [])
    .map((o) => ({
      ...o,
      total: o.price + o.shipping - o.discount,
      name: catalog.data!.platforms.find((p) => p.id === o.platform_id)?.name ?? o.platform_id,
    }))
    .sort((a, b) => a.total - b.total)
    .slice(0, 4);
  const plans = subscription.data?.plans ?? [];

  return (
    <div className="flex flex-col gap-14 md:gap-20">
      {/* HERO */}
      <section className="flex flex-wrap items-center gap-10">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
          <SectionTag>{t.tag}</SectionTag>
          <h1 className="text-4xl font-bold md:text-6xl">{t.title}</h1>
          <p className="text-2xl font-semibold text-brand md:text-3xl">{t.headline}</p>
          <p className="text-lg text-ink-muted">{t.lead}</p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/market/trends?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="min-h-[52px] min-w-0 flex-1 rounded-xl border border-line px-4 text-base"
            />
            <button type="submit" className="min-h-[52px] rounded-xl bg-brand px-6 font-semibold text-white">
              {t.search}
            </button>
          </form>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {t.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="text-brand" aria-hidden="true">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3 rounded-3xl border border-line bg-brand-tint p-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- static illustration */}
            <img src="/headphone.jpg" alt="" className="h-20 w-20 rounded-2xl object-cover" />
            <div>
              <div className="font-semibold">{HERO_PRODUCT}</div>
              <div className="text-sm text-[#D9891A]">★★★★★ {heroOffers[0] ? `(${heroOffers[0].rating.toFixed(1)})` : ""}</div>
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {heroOffers.map((o, i) => (
              <li key={o.platform_id} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2">
                <PlatformBadge id={o.platform_id} name={o.name} />
                <span className="flex-1 font-medium">{o.name}</span>
                <b>฿{o.total.toLocaleString("en-US")}</b>
                {i === 0 && (
                  <span className="rounded-full bg-[#10B981] px-2 text-xs font-semibold text-white">{t.bestPrice}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-right text-sm italic text-brand">{t.note}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {t.strip.map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-line p-5">
            <div className="font-semibold">{title}</div>
            <p className="text-sm text-ink-muted">{body}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-wrap items-center gap-8 rounded-3xl bg-[#F5F9FF] p-6 md:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element -- static illustration */}
        <img src="/hero-phone.png" alt="" className="w-full max-w-[520px] flex-[1_1_320px]" />
        <a
          href="https://line.me/R/ti/p/@734swwju"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-[1_1_220px] flex-col items-center gap-3 text-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- generated QR for the LINE add-friend link */}
          <img src="/qr-line.svg" alt="QR เพิ่มเพื่อน U-Renger ใน LINE" className="h-44 w-44 rounded-xl bg-white p-2" />
          <span className="font-semibold">{t.qr}</span>
          <span className="text-sm text-brand">@734swwju</span>
        </a>
      </section>

      {/* PROBLEM */}
      <section className="flex flex-col gap-6">
        <SectionTag>{t.problemTag}</SectionTag>
        <h2 className="text-3xl font-bold">{t.problemTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {t.problems.map(([title, body], i) => (
            <div key={title} className="flex flex-col gap-2 rounded-2xl border border-line p-6">
              <span className="font-mono text-2xl font-bold text-brand-light">{String(i + 1).padStart(2, "0")}</span>
              <div className="text-lg font-semibold">{title}</div>
              <p className="text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="flex flex-col gap-6">
        <SectionTag>{t.capTag}</SectionTag>
        <h2 className="text-3xl font-bold">{t.capTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.caps.map(([tag, title, body, cta, href]) => (
            <Link key={title} href={href} className="flex flex-col gap-2 rounded-2xl border border-line p-6 hover:border-brand">
              <span className="font-mono text-xs font-semibold text-brand">{tag}</span>
              <div className="text-lg font-semibold">{title}</div>
              <p className="flex-1 text-sm text-ink-muted">{body}</p>
              <span className="text-sm font-semibold text-brand">{cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="flex flex-col gap-6">
        <SectionTag>{t.flowTag}</SectionTag>
        <h2 className="text-3xl font-bold">{t.flowTitle}</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-2xl border border-line p-6">
            <h3 className="text-lg font-semibold">{t.lineTrack}</h3>
            <ol className="flex flex-col gap-3">
              {t.lineSteps.map(([title, body], i) => (
                <li key={title} className="flex gap-3">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#06C755] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold">{title}</div>
                    <p className="text-sm text-ink-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-2 rounded-xl bg-[#8CABD9]/20 p-4 text-sm">
              <div className="text-xs font-semibold text-ink-muted">{t.chat.bot}</div>
              <div className="self-end rounded-2xl bg-[#06C755] px-3 py-2 text-white">{t.chat.slip}</div>
              <div className="self-start rounded-2xl bg-white px-3 py-2">{t.chat.saved}</div>
              <div className="self-end rounded-2xl bg-[#06C755] px-3 py-2 text-white">{t.chat.ask}</div>
              <div className="self-start rounded-2xl bg-white px-3 py-2">{t.chat.answer}</div>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-line p-6">
            <h3 className="text-lg font-semibold">{t.webTrack}</h3>
            <ol className="flex flex-col gap-3">
              {t.webSteps.map(([title, body, href], i) => (
                <li key={title}>
                  <Link href={href} className="flex gap-3 rounded-xl p-2 hover:bg-[#F5F7FA]">
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-brand text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-semibold">{title}</div>
                      <p className="text-sm text-ink-muted">{body}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* PRICING */}
      {plans.length > 0 && (
        <section className="flex flex-col gap-6">
          <SectionTag>{t.pricingTag}</SectionTag>
          <h2 className="text-3xl font-bold">{t.pricingTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {plans.map((plan) => {
              const premium = plan.price_thb_per_month > 0;
              return (
                <div
                  key={plan.plan_id}
                  className={`flex flex-col gap-3 rounded-2xl p-6 ${premium ? "border-2 border-brand bg-brand-tint" : "border border-line"}`}
                >
                  <span className="font-mono text-xs font-semibold text-brand">{plan.name.toUpperCase()}</span>
                  <div className="text-4xl font-bold">
                    ฿{plan.price_thb_per_month}
                    <span className="ml-2 text-sm font-normal text-ink-muted">
                      {premium
                        ? `${th.marketRadar.plans.perMonth} · ${th.marketRadar.plans.trial.replace("{days}", String(plan.trial_days ?? 7))}`
                        : th.marketRadar.plans.forever}
                    </span>
                  </div>
                  <p className="flex-1 text-sm text-ink-muted">
                    {plan.features.map((f) => (th.marketRadar.plans.features as Record<string, string>)[f] ?? f).join(" · ")}
                  </p>
                  <Link
                    href={premium ? "/market/plans" : "https://line.me/R/ti/p/@734swwju"}
                    className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-sm font-semibold ${
                      premium ? "bg-brand text-white" : "border-[1.5px] border-brand text-brand"
                    }`}
                  >
                    {premium ? t.premiumCta : t.freeCta}
                  </Link>
                </div>
              );
            })}
          </div>
          <Link href="/market/plans" className="self-center text-sm font-semibold text-brand">
            {t.allPlans}
          </Link>
        </section>
      )}

      <section className="flex flex-col items-center gap-4 rounded-3xl bg-navy p-10 text-center text-white">
        <h2 className="text-3xl font-bold">{t.ctaTitle}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex min-h-[48px] items-center rounded-full bg-white px-6 font-semibold text-navy">
            {t.openDashboard}
          </Link>
          <Link
            href="/market/plans"
            className="inline-flex min-h-[48px] items-center rounded-full border-[1.5px] border-white px-6 font-semibold"
          >
            {t.premiumCta}
          </Link>
        </div>
      </section>

      <footer className="pb-4 text-center text-sm text-ink-faint">{t.footer}</footer>
    </div>
  );
}
