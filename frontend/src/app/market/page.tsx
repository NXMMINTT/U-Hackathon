"use client";

import Link from "next/link";

import { PlatformTrendChart } from "@/components/market/PlatformTrendChart";
import { PriceRadarChart } from "@/components/market/PriceRadarChart";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  type Sponsor,
  useCompetitorPrices,
  useEuArbitrage,
  useKeywordVolume,
  useMarketTrend,
  usePlatforms,
  useSponsors,
  useUBotInsights,
} from "@/hooks/useMarket";
import { apiFetch } from "@/lib/api-client";
import { isAvailable } from "@/lib/market";
import th from "@/locales/th.json";

const t = th.marketRadar.overview;
const TREND_TONE = { up: "info", stable: "neutral", down: "neutral" } as const;
const EUR_TO_THB = 39; // same demo rate as lib/market.ts

function openSponsor(s: Sponsor) {
  // Click tracking is best-effort; never block the partner link on it.
  apiFetch(`/api/b2b/sponsors/${s.listing_id}/click`, { method: "POST" }).catch(() => {});
  window.open(s.cta_link, "_blank", "noopener,noreferrer");
}

export default function MarketOverviewPage() {
  const prices = useCompetitorPrices();
  const trend = useMarketTrend();
  const keywords = useKeywordVolume();
  const eu = useEuArbitrage();
  const platforms = usePlatforms();
  const sponsors = useSponsors(prices.data?.product_id);
  const ubot = useUBotInsights(prices.data?.product_id);

  const error = prices.error ?? trend.error ?? keywords.error ?? eu.error;
  if (error) return <Card className="border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">{error.message}</Card>;
  if (!prices.data) return <Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>;

  const p = prices.data;
  const thai = p.competitors.filter((c) => c.currency === "THB" && c.price !== null);
  const positionPct = Math.round(
    ((p.my_selling_price - p.price_distribution_thb.median) / p.price_distribution_thb.median) * 100,
  );
  const maxVolume = Math.max(...(keywords.data ?? []).map((k) => k.search_volume), 1);
  const regions = Object.entries(
    (platforms.data ?? []).reduce<Record<string, number>>((acc, pl) => ({ ...acc, [pl.region]: (acc[pl.region] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-[22px]">
      <section className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold md:text-2xl">{p.product_name}</h2>
          <span className="text-[13px] text-ink-faint">
            {t.foundIn
              .replace("{platforms}", String(new Set(p.competitors.map((c) => c.platform_id)).size))
              .replace("{sellers}", String(p.competitors.length))}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label={t.myCost} value={`฿${p.my_cost_price}`} />
        <StatCard label={t.myPrice} value={`฿${p.my_selling_price}`} />
        <StatCard label={t.median} value={`฿${p.price_distribution_thb.median}`} />
        <StatCard
          label={t.position}
          value={`${positionPct > 0 ? "+" : ""}${positionPct}%`}
          caption={(positionPct >= 0 ? t.above : t.below).replace("{pct}", String(Math.abs(positionPct)))}
          tone="primary"
        />
      </div>

      <div className="flex flex-wrap items-start gap-[22px]">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-[22px]">
          <Card className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold">{t.radarTitle}</h2>
              <Link href="/market/compare" className="text-sm font-semibold text-brand hover:text-brand-dark">
                {th.marketRadar.nav.compare} →
              </Link>
            </div>
            <p className="text-xs text-ink-muted">{t.radarHint}</p>
            <PriceRadarChart data={p} />
            <p className="text-xs text-ink-muted">
              {th.marketRadar.compare.vsMarket
                .replace("{count}", String(thai.filter((c) => isAvailable(c) && (c.price ?? 0) > p.my_selling_price).length))
                .replace("{total}", String(thai.filter(isAvailable).length))}
            </p>
          </Card>

          {trend.data && (
            <Card className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">{t.trendTitle}</h2>
              <PlatformTrendChart data={trend.data} />
            </Card>
          )}

          {eu.data && (
            <Card className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">{t.euTitle}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {eu.data.map((item) => {
                  const retailTHB = Math.round(item.eu_market.avg_retail_price_eur * EUR_TO_THB);
                  return (
                    <div
                      key={item.product_id}
                      className="flex flex-col gap-2 rounded-xl border border-line-subtle bg-[#F5F7FA] p-4"
                    >
                      <div>
                        <div className="font-semibold">{item.product_name}</div>
                        <div className="text-xs text-ink-muted">{item.eu_market.region}</div>
                      </div>
                      <dl className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <dt className="text-ink-muted">{t.euThai}</dt>
                          <dd className="text-base font-semibold">฿{item.thailand_avg_price_thb}</dd>
                        </div>
                        <div>
                          <dt className="text-ink-muted">{t.euRetail}</dt>
                          <dd className="text-base font-semibold">€{item.eu_market.avg_retail_price_eur}</dd>
                          <dd className="text-ink-muted">≈฿{retailTHB}</dd>
                        </div>
                        <div>
                          <dt className="text-ink-muted">{t.euWholesale}</dt>
                          <dd className="text-base font-semibold">€{item.eu_market.suggested_wholesale_price_eur}</dd>
                        </div>
                      </dl>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-ink-muted">{t.euDemand}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${item.eu_market.demand_score}%` }} />
                        </div>
                        <b>{item.eu_market.demand_score}/100</b>
                      </div>
                      <p className="text-xs text-ink-body">{item.eu_market.demand_note}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-[22px]">
          <section
            className="flex flex-col gap-3 rounded-2xl bg-navy p-5 text-white"
            aria-busy={ubot.isLoading || ubot.refresh.isPending}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{t.insightsTitle}</h2>
              {ubot.data && (
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px]">
                  {ubot.data.generated_by === "gemini" ? t.byGemini : t.byRules}
                </span>
              )}
            </div>
            {!ubot.data ? (
              <p className="text-sm text-[#CBD5E1]">{ubot.error ? ubot.error.message : t.thinking}</p>
            ) : (
              <>
                <div className="rounded-xl bg-white px-4 py-3 text-navy">
                  <div className="text-xs text-ink-muted">{t.suggestedPrice}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[26px] font-bold">฿{ubot.data.suggested_price}</span>
                    <span className="text-sm text-ink-muted">{t.vsYours.replace("{price}", String(p.my_selling_price))}</span>
                  </div>
                  <p className="text-xs text-ink-body">{ubot.data.reason}</p>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {ubot.data.insights.map((text) => (
                    <li key={text} className="rounded-xl bg-white/10 px-3.5 py-2.5 text-sm leading-relaxed">
                      {text}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/market/chat"
                className="inline-flex min-h-[40px] items-center rounded-[10px] bg-white px-4 text-sm font-semibold text-navy"
              >
                {t.askUBot}
              </Link>
              <button
                type="button"
                onClick={() => ubot.refresh.mutate()}
                disabled={ubot.refresh.isPending}
                className="inline-flex min-h-[40px] items-center rounded-[10px] border border-white/40 px-4 text-sm font-semibold disabled:opacity-50"
              >
                {ubot.refresh.isPending ? t.thinking : t.reanalyze}
              </button>
            </div>
          </section>

          {keywords.data && (
            <Card className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">{t.keywordsTitle}</h2>
              <ul className="flex flex-col gap-3">
                {[...keywords.data]
                  .sort((a, b) => b.search_volume - a.search_volume)
                  .map((k) => (
                    <li key={`${k.keyword}-${k.platform}`} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="min-w-0 truncate font-semibold">{k.keyword}</span>
                        <Badge tone={TREND_TONE[k.trend]}>{t.trend[k.trend]}</Badge>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-line-subtle">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${(k.search_volume / maxVolume) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-ink-muted">
                        {k.platform} · {k.search_volume.toLocaleString("en-US")} {t.searches}
                      </span>
                    </li>
                  ))}
              </ul>
            </Card>
          )}

          {sponsors.data && sponsors.data.length > 0 && (
            <Card className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">{t.sponsoredTitle}</h2>
              {sponsors.data.map((s) => (
                <div
                  key={s.listing_id}
                  className="flex flex-col gap-1.5 border-t border-line-subtle pt-3 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-ink-muted">
                      {s.sponsor_name} · {s.sponsor_type}
                    </span>
                    <Badge tone="neutral">{t.sponsored}</Badge>
                  </div>
                  <div className="text-sm font-semibold">{s.product_name}</div>
                  <p className="text-xs text-ink-body">{s.description}</p>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span>
                      <b>฿{s.price.toLocaleString("en-US")}</b>
                      <span className="text-xs text-ink-muted">
                        {" "}
                        / {s.unit} · {t.moq.replace("{moq}", String(s.moq)).replace("{unit}", s.unit)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => openSponsor(s)}
                      className="inline-flex min-h-[36px] items-center rounded-[10px] border-[1.5px] border-brand px-3 text-xs font-semibold text-brand"
                    >
                      {t.visit}
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {platforms.data && (
            <Card className="flex flex-col gap-2.5">
              <h2 className="text-lg font-semibold">{t.platformsTitle}</h2>
              <p className="text-sm text-ink-muted">{t.platformsCount.replace("{count}", String(platforms.data.length))}</p>
              <div className="flex flex-wrap gap-2">
                {regions.map(([region, count]) => (
                  <Badge key={region} tone="neutral">
                    {region} · {count}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
