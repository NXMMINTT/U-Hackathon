"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { CategoryThumb } from "@/components/market/CategoryThumb";
import { Sparkline } from "@/components/market/Sparkline";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useTrendCatalog } from "@/hooks/market/useTrendCatalog";
import type { CatalogProduct } from "@/types/market";
import { loadPickedPlatforms } from "@/lib/market/pickedPlatforms";
import { formatGrowth, TREND_STATUS_TONE, trendStatus } from "@/lib/market/trendStatus";
import th from "@/locales/th.json";

const t = th.marketRadar.trends;
const baht = (n: number) => `฿${Math.round(n).toLocaleString("en-US")}`;
const DEFAULT_CHIPS = 8;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-[44px] flex-none rounded-full border-2 px-4 text-[15px] font-semibold ${
        active ? "border-brand bg-brand text-white" : "border-[#C7DEFC] bg-white text-ink hover:border-brand"
      }`}
    >
      {children}
    </button>
  );
}

function TrendsView() {
  const router = useRouter();
  const params = useSearchParams();
  const catalog = useTrendCatalog();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [tab, setTab] = useState<"hot" | "rising">("hot");
  const [pf, setPf] = useState("all");
  const [picked, setPicked] = useState<string[] | null>(null);
  const catId = params.get("cat");

  useEffect(() => setPicked(loadPickedPlatforms()), []);

  if (catalog.error) return <Card className="border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">{catalog.error.message}</Card>;
  if (!catalog.data) return <Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>;

  const { categories, products } = catalog.data;
  // Picked on /market/platforms; until then show the first few (Thai majors) so the chip row stays short.
  const platforms = picked?.length ? catalog.data.platforms.filter((p) => picked.includes(p.id)) : catalog.data.platforms.slice(0, DEFAULT_CHIPS);
  const catOf = (p: CatalogProduct) => categories.find((c) => c.category_id === p.category_id)!;
  const category = categories.find((c) => c.category_id === catId);
  const query = q.trim();

  const results = !query
    ? []
    : [
        ...categories
          .filter((c) => c.name.includes(query))
          .map((c) => ({
            key: c.category_id,
            href: `/market/trends?cat=${c.category_id}`,
            name: c.name,
            sub: t.categorySub.replace("{count}", String(products.filter((p) => p.category_id === c.category_id).length)),
            cat: c,
          })),
        ...products
          .filter((p) => p.name.includes(query))
          .map((p) => ({
            key: p.product_id,
            href: `/market/products/${p.product_id}`,
            name: p.name,
            sub: `${catOf(p).name} · ${t.status[trendStatus(p.search_growth_pct)]}`,
            cat: catOf(p),
          })),
      ].slice(0, 8);

  const priceCell = (p: CatalogProduct) => {
    const visible = p.prices.filter((x) => platforms.some((pl) => pl.id === x.platform_id));
    if (pf === "all") {
      const ps = visible.filter((x) => x.available).map((x) => x.price!);
      return {
        caption: t.priceRange.replace("{count}", String(ps.length)),
        price: ps.length ? `${baht(Math.min(...ps))} – ${baht(Math.max(...ps))}` : t.notSold,
      };
    }
    const x = p.prices.find((y) => y.platform_id === pf);
    const name = platforms.find((pl) => pl.id === pf)?.name ?? pf;
    return { caption: t.priceOn.replace("{platform}", name), price: x?.available ? baht(x.price!) : t.notSold };
  };

  return (
    <div className="flex flex-col gap-[22px]">
      {category && (
        <nav aria-label="ตำแหน่งหน้า" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-faint">
          <Link href="/market/trends" className="hover:text-brand">
            {t.allCategories}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-ink-body">{category.name}</span>
        </nav>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="m-0 text-2xl font-bold md:text-[28px]">{category?.name ?? t.title}</h2>
        <p className="m-0 text-sm text-ink-muted">{t.statusLegend}</p>
        {!category && (
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="min-h-[54px] w-full rounded-full border-2 border-[#C7DEFC] bg-white px-6 pr-24 text-[17px] shadow-[0_10px_24px_rgba(26,111,214,.08)] focus:border-brand"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-brand"
              >
                {t.clear}
              </button>
            )}
          </div>
        )}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          <Chip active={pf === "all"} onClick={() => setPf("all")}>
            {t.allPlatforms}
          </Chip>
          {platforms.map((p) => (
            <Chip key={p.id} active={pf === p.id} onClick={() => setPf(p.id)}>
              {p.name}
            </Chip>
          ))}
          <Link
            href="/market/platforms"
            className="inline-flex min-h-[44px] flex-none items-center rounded-full border-2 border-dashed border-sky-line px-4 font-hand text-[15px] font-bold text-brand no-underline"
          >
            + เลือกแพลตฟอร์มเพิ่ม
          </Link>
        </div>
      </div>

      {query && (
        <Card className="flex flex-col gap-1">
          {results.length === 0 ? (
            <p className="text-sm text-ink-muted">{t.noResults}</p>
          ) : (
            results.map((r) => (
              <Link key={r.key} href={r.href} className="flex items-center gap-3 rounded-[10px] px-2 py-2 hover:bg-[#F5F7FA]">
                <CategoryThumb categoryId={r.cat.category_id} path={r.cat.icon_path} />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{r.name}</span>
                  <span className="block text-xs text-ink-muted">{r.sub}</span>
                </span>
              </Link>
            ))
          )}
        </Card>
      )}

      {!category && !query && (
        <>
          <section className="flex flex-col gap-3">
            <div>
              <h2 className="text-lg font-semibold">{t.forecastTitle}</h2>
              <p className="text-xs text-ink-muted">{t.forecastHint}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...products]
                .sort((a, b) => b.search_growth_pct - a.search_growth_pct)
                .slice(0, 6)
                .map((p, i) => (
                  <Link
                    key={p.product_id}
                    href={`/market/products/${p.product_id}`}
                    className="flex flex-col gap-2 rounded-[24px] bg-white p-5 text-ink no-underline transition-transform hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(26,111,214,.12)]"
                  >
                    <div className="flex items-center gap-3">
                      <CategoryThumb categoryId={p.category_id} path={catOf(p).icon_path} />
                      <div className="min-w-0">
                        <Badge tone="warning">{t.hotRank.replace("{rank}", String(i + 1))}</Badge>
                        <div className="truncate font-semibold">{p.name}</div>
                        <div className="truncate text-xs text-ink-muted">{catOf(p).name}</div>
                      </div>
                    </div>
                    <Sparkline values={p.search_index.slice(0, 8)} />
                    <div className="flex justify-between text-xs">
                      <b className="text-income">{t.growthSearch.replace("{growth}", formatGrowth(p.search_growth_pct))}</b>
                      <span className="text-ink-muted">{t.peakIn.replace("{days}", String(p.peak_in_days))}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">{t.categoriesTitle}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((c) => (
                <button
                  key={c.category_id}
                  type="button"
                  onClick={() => router.push(`/market/trends?cat=${c.category_id}`)}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-4 text-center text-sm font-medium hover:border-brand"
                >
                  <CategoryThumb categoryId={c.category_id} path={c.icon_path} size={52} />
                  {c.name}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {category && (
        <Card className="flex flex-col gap-3">
          <div role="tablist" className="flex gap-2">
            {(["hot", "rising"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`min-h-[40px] rounded-[10px] px-[18px] text-sm font-semibold ${tab === key ? "bg-brand text-white" : "bg-line-subtle text-ink-body"}`}
              >
                {key === "hot" ? t.tabHot : t.tabRising}
              </button>
            ))}
          </div>
          <ol className="flex flex-col">
            {products
              .filter((p) => p.category_id === category.category_id)
              .sort((a, b) => (tab === "hot" ? b.sold_per_month - a.sold_per_month : b.search_growth_pct - a.search_growth_pct))
              .map((p, i) => {
                const status = trendStatus(p.search_growth_pct);
                const cell = priceCell(p);
                return (
                  <li key={p.product_id} className="border-t border-line-subtle first:border-t-0">
                    <Link
                      href={`/market/products/${p.product_id}`}
                      className="flex flex-wrap items-center gap-3 py-3 hover:bg-[#F8FAFC]"
                    >
                      <span className="w-6 text-center text-lg font-bold text-ink-faint">{i + 1}</span>
                      <CategoryThumb categoryId={p.category_id} path={category.icon_path} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{p.name}</span>
                          <Badge tone={TREND_STATUS_TONE[status]}>{t.status[status]}</Badge>
                        </div>
                        <div className="text-xs text-ink-muted">
                          {t.soldPerMonth.replace("{sold}", p.sold_per_month.toLocaleString("en-US"))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-ink-muted">{cell.caption}</div>
                        <div className="font-semibold">{cell.price}</div>
                        <div className={`text-xs font-semibold ${p.search_growth_pct >= 0 ? "text-income" : "text-ink-faint"}`}>
                          {formatGrowth(p.search_growth_pct)}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
          </ol>
        </Card>
      )}
    </div>
  );
}

export default function TrendsPage() {
  // useSearchParams needs a Suspense boundary for static rendering.
  return (
    <Suspense fallback={<Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>}>
      <TrendsView />
    </Suspense>
  );
}
