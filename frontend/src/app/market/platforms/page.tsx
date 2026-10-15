"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/Card";
import { useTrendCatalog } from "@/hooks/useMarket";
import { loadPickedPlatforms, platformLogo, savePickedPlatforms } from "@/lib/market";
import th from "@/locales/th.json";

const t = th.marketRadar.platforms;

export default function PlatformsPage() {
  const catalog = useTrendCatalog();
  // null = never chosen, which means every platform (same default as the trends page)
  const [saved, setSaved] = useState<string[] | null>(null);

  useEffect(() => setSaved(loadPickedPlatforms()), []);

  function update(next: string[]) {
    setSaved(next);
    savePickedPlatforms(next);
  }

  if (catalog.error) return <Card className="border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">{catalog.error.message}</Card>;
  if (!catalog.data) return <Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>;

  const platforms = catalog.data.platforms;
  const picked = saved ?? platforms.map((p) => p.id);

  return (
    <div className="flex flex-col gap-[22px]">
      <div>
        <h2 className="text-xl font-semibold md:text-2xl">{t.title}</h2>
        <p className="text-ink-muted">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {platforms.map((p) => {
          const on = picked.includes(p.id);
          const logo = platformLogo(p.id);
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              onClick={() => update(on ? picked.filter((x) => x !== p.id) : [...picked, p.id])}
              className={`relative flex flex-col items-center gap-3 rounded-[20px] border-2 px-5 pb-6 pt-7 text-center ${
                on ? "border-brand bg-[#EEF4FC] shadow-[0_6px_20px_rgba(31,95,191,0.12)]" : "border-line bg-white"
              }`}
            >
              {on && (
                <span
                  className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-brand text-sm text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
              <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl bg-white">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- static logo
                  <img src={logo} alt="" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-3xl font-bold text-brand">{p.name.charAt(0)}</span>
                )}
              </span>
              <span className="text-lg font-semibold">{p.name}</span>
              <span className="text-xs text-ink-muted">{p.description}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold">{picked.length ? t.picked.replace("{count}", String(picked.length)) : t.none}</span>
          <button type="button" onClick={() => update(platforms.map((p) => p.id))} className="font-semibold text-brand">
            {t.selectAll}
          </button>
        </div>
        <Link
          href="/market/trends"
          aria-disabled={!picked.length}
          className={`inline-flex min-h-[48px] items-center rounded-xl px-[22px] font-semibold text-white ${
            picked.length ? "bg-brand" : "pointer-events-none bg-[#94A3B8]"
          }`}
        >
          {t.go} →
        </Link>
      </div>
    </div>
  );
}
