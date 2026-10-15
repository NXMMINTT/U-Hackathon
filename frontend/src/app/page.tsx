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
import { formatTHB, formatThaiDate } from "@/lib/format";
import th from "@/locales/th.json";

export default function MyBusinessPage() {
  const health = useApiHealth();
  const overview = useOverview();
  const taxMeter = useTaxMeter();
  const error = overview.error ?? taxMeter.error;

  const income = Number(overview.data?.income ?? 0);
  const margin = income > 0 ? (Number(overview.data?.net_profit) / income) * 100 : null;

  return (
    <div className="flex flex-col gap-[22px]">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold leading-snug md:text-[30px]">
            {overview.data
              ? th.myBusiness.greeting.replace("{name}", overview.data.business_name)
              : th.tabs.myBusiness}
          </h1>
          {overview.data && (
            <p className="text-ink-muted">
              {th.myBusiness.monthToDate} {formatThaiDate(overview.data.period_start)} –{" "}
              {formatThaiDate(overview.data.period_end)}
            </p>
          )}
        </div>
        <Badge tone={health.isLoading ? "neutral" : health.isError ? "danger" : "success"}>
          {health.isLoading ? "..." : health.isError ? th.backend.disconnected : th.backend.connected}
        </Badge>
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
