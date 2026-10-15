"use client";

import Link from "next/link";

import { RevenueTrendChart } from "@/components/charts/RevenueTrendChart";
import { TaxMeter } from "@/components/TaxMeter";
import { TopProducts } from "@/components/TopProducts";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { useApiHealth } from "@/hooks/useApiHealth";
import { useOverview, useTaxMeter } from "@/hooks/useDashboard";
import { useSubscription, useTrendCatalog } from "@/hooks/useMarket";
import { formatTHB, formatThaiDate } from "@/lib/format";
import th from "@/locales/th.json";

export default function MyBusinessPage() {
  const health = useApiHealth();
  const overview = useOverview();
  const taxMeter = useTaxMeter();
  // Market Radar teasers from NIGHT's dashboard; these are mock-data and may fail independently.
  const catalog = useTrendCatalog();
  const subscription = useSubscription();
  const error = overview.error ?? taxMeter.error;
  const alerts = [...(catalog.data?.products ?? [])].sort((a, b) => b.search_growth_pct - a.search_growth_pct).slice(0, 3);
  const plan = subscription.data?.current_user;
  const tm = th.marketRadar.dashboard;

  const income = Number(overview.data?.income ?? 0);
  const margin = income > 0 ? (Number(overview.data?.net_profit) / income) * 100 : null;

  return (
    <div className="flex flex-col gap-[22px]">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold leading-snug md:text-[30px]">
            {overview.data ? th.myBusiness.greeting.replace("{name}", overview.data.business_name) : th.tabs.myBusiness}
          </h1>
          {overview.data && (
            <p className="text-ink-muted">
              {th.myBusiness.monthToDate} {formatThaiDate(overview.data.period_start)} –{" "}
              {formatThaiDate(overview.data.period_end)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {plan && (
            <Link
              href="/market/plans"
              className="rounded-full border border-line px-3 py-1 text-xs text-ink-body hover:border-brand"
            >
              {tm.plan} <b className="text-navy">{subscription.data?.plans.find((p) => p.plan_id === plan.plan_id)?.name}</b>
            </Link>
          )}
          <Badge tone={health.isLoading ? "neutral" : health.isError ? "danger" : "success"}>
            {health.isLoading ? "..." : health.isError ? th.backend.disconnected : th.backend.connected}
          </Badge>
        </div>
      </header>

      {error && <Card className="border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">{error.message}</Card>}
      {(overview.isLoading || taxMeter.isLoading) && (
        <Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>
      )}

      {overview.data && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="col-span-2 md:col-span-1">
            <StatCard label={th.myBusiness.income} value={formatTHB(overview.data.income)} tone="primary" />
          </div>
          <StatCard label={th.myBusiness.expense} value={formatTHB(overview.data.expense)} tone="expense" />
          <StatCard
            label={th.myBusiness.netProfit}
            value={formatTHB(overview.data.net_profit)}
            caption={margin === null ? undefined : th.myBusiness.profitMargin.replace("{percent}", margin.toFixed(0))}
          />
        </div>
      )}

      <div className="flex flex-wrap items-start gap-[22px]">
        {overview.data && (
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-[22px]">
            <Card className="flex flex-col gap-3.5">
              <h2 className="text-lg font-semibold">{th.myBusiness.trendTitle}</h2>
              <RevenueTrendChart daily={overview.data.daily} />
            </Card>
            <TopProducts products={overview.data.top_products} />
          </div>
        )}

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-[22px]">
          {taxMeter.data && <TaxMeter data={taxMeter.data} />}

          {alerts.length > 0 && (
            <Card className="flex flex-col gap-1">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{tm.alertsTitle}</h2>
                <Link href="/market/trends" className="text-sm font-semibold text-brand hover:text-brand-dark">
                  {tm.seeAll}
                </Link>
              </div>
              {alerts.map((p) => (
                <Link
                  key={p.product_id}
                  href={`/market/products/${p.product_id}`}
                  className="flex items-center gap-3 border-t border-line-subtle py-2.5 first:border-t-0"
                >
                  <span className="h-2.5 w-2.5 flex-none rounded-full bg-brand" aria-hidden="true" />
                  <span className="min-w-0">
                    <b className="block truncate text-sm font-semibold">{p.name}</b>
                    <span className="text-xs text-ink-muted">
                      {tm.alertLine.replace("{growth}", String(p.search_growth_pct)).replace("{days}", String(p.peak_in_days))}
                    </span>
                  </span>
                </Link>
              ))}
            </Card>
          )}

          {plan && !plan.is_premium && (
            <section className="flex flex-col gap-2.5 rounded-2xl border-2 border-brand bg-brand-tint p-[22px]">
              <h2 className="text-[17px] font-semibold">{tm.premiumTitle}</h2>
              <p className="text-sm text-ink-body">{tm.premiumBody}</p>
              <Link
                href="/market/plans"
                className="inline-flex min-h-[44px] items-center self-start rounded-full bg-brand px-[18px] text-sm font-semibold text-white"
              >
                {tm.premiumCta}
              </Link>
            </section>
          )}

          {overview.data && (
            <Card className="flex flex-col gap-1">
              <h2 className="mb-1 text-lg font-semibold">{th.myBusiness.quickLinks}</h2>
              {[
                { href: "/transactions", label: th.transactions.title },
                { href: "/stock", label: th.stock.title },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between border-t border-line-subtle py-2.5 text-sm font-semibold text-brand first:border-t-0 hover:text-brand-dark"
                >
                  {link.label}
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
