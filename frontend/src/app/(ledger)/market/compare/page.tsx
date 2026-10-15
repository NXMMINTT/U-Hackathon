"use client";

import { useState } from "react";

import { PlatformBadge } from "@/components/market/PlatformBadge";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useCompetitorPrices } from "@/hooks/market/useCompetitorPrices";
import { isAvailable } from "@/lib/market/competitorAvailability";
import { toTHB } from "@/lib/market/currency";
import { productEmoji } from "@/lib/market/productEmoji";
import { productPhoto } from "@/lib/market/productPhoto";
import th from "@/locales/th.json";

const t = th.marketRadar.compare;
type Sort = "cheapest" | "priciest" | "platform";

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-[36px] items-center rounded-[10px] px-3 text-sm ${
        active ? "bg-navy font-semibold text-white" : "border border-line bg-white text-ink-body"
      }`}
    >
      {children}
    </button>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-ink-muted">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        value={Number.isNaN(value) ? "" : value}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        className="min-h-[44px] rounded-[10px] border border-line px-3 text-base font-semibold text-navy"
      />
    </label>
  );
}

export default function ComparePage() {
  const { data, error, isLoading } = useCompetitorPrices();
  const [sort, setSort] = useState<Sort>("cheapest");
  const [thaiOnly, setThaiOnly] = useState(true);
  const [cost, setCost] = useState<number | null>(null);
  const [sellPrice, setSellPrice] = useState<number | null>(null);
  const [feePct, setFeePct] = useState(10);

  if (error) return <Card className="border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">{error.message}</Card>;
  if (isLoading || !data) return <Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>;

  const rows = data.competitors
    .filter((c) => !thaiOnly || c.currency === "THB")
    .map((c) => ({ ...c, thb: toTHB(c.price, c.currency) }))
    .sort((a, b) => {
      if (sort === "platform") return a.platform.localeCompare(b.platform);
      // Listings without a price always sink to the bottom.
      const pa = a.thb ?? Number.POSITIVE_INFINITY;
      const pb = b.thb ?? Number.POSITIVE_INFINITY;
      return sort === "cheapest" ? pa - pb : (b.thb ?? -1) - (a.thb ?? -1);
    });

  const available = rows.filter((r) => isAvailable(r) && r.thb !== null);
  const cheapest = available.reduce<(typeof available)[number] | null>((m, r) => (!m || r.thb! < m.thb! ? r : m), null);
  const priciest = available.reduce<(typeof available)[number] | null>((m, r) => (!m || r.thb! > m.thb! ? r : m), null);

  const unitCost = cost ?? data.my_cost_price;
  const price = sellPrice ?? data.my_selling_price;
  const feeBaht = (price * (feePct || 0)) / 100;
  const profit = price - unitCost - feeBaht;
  const margin = price > 0 ? (profit / price) * 100 : 0;
  const thaiAvailable = data.competitors.filter((c) => c.currency === "THB" && isAvailable(c));

  return (
    <div className="flex flex-col gap-[22px]">
      <h2 className="flex items-center gap-3 text-xl font-semibold md:text-2xl">
        <span className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-[10px] bg-[#E3EEFB] text-xl" aria-hidden="true">
          {productPhoto(data.product_name) ? (
            // eslint-disable-next-line @next/next/no-img-element -- static product photo
            <img src={productPhoto(data.product_name)!} alt="" className="h-full w-full object-cover" />
          ) : (
            productEmoji(data.product_name)
          )}
        </span>
        {t.title} · {data.product_name}
      </h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-[#ECFDF5] px-4 py-3.5 text-[#065F46]">
          <div className="text-xs">{t.cheapest}</div>
          <div className="text-[22px] font-bold">{cheapest ? `฿${cheapest.thb}` : "-"}</div>
          <div className="text-xs">{cheapest ? `${cheapest.platform} · ${cheapest.seller}` : ""}</div>
        </div>
        <div className="rounded-xl bg-line-subtle px-4 py-3.5 text-ink-body">
          <div className="text-xs">{t.priciest}</div>
          <div className="text-[22px] font-bold text-navy">{priciest ? `฿${priciest.thb}` : "-"}</div>
          <div className="text-xs">{priciest ? `${priciest.platform} · ${priciest.seller}` : ""}</div>
        </div>
        <div className="rounded-xl bg-brand-soft px-4 py-3.5 text-[#1E40AF]">
          <div className="text-xs">{t.spread}</div>
          <div className="text-[22px] font-bold">{cheapest && priciest ? `฿${priciest.thb! - cheapest.thb!}` : "-"}</div>
          <div className="text-xs">
            {th.marketRadar.overview.myPrice} ฿{data.my_selling_price}
          </div>
        </div>
      </div>

      <Card className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="group" className="flex flex-wrap gap-2">
            <Toggle active={sort === "cheapest"} onClick={() => setSort("cheapest")}>
              {t.sortCheapest}
            </Toggle>
            <Toggle active={sort === "priciest"} onClick={() => setSort("priciest")}>
              {t.sortPriciest}
            </Toggle>
            <Toggle active={sort === "platform"} onClick={() => setSort("platform")}>
              {t.sortPlatform}
            </Toggle>
          </div>
          <div role="group" className="flex flex-wrap gap-2">
            <Toggle active={thaiOnly} onClick={() => setThaiOnly(true)}>
              {t.thaiOnly}
            </Toggle>
            <Toggle active={!thaiOnly} onClick={() => setThaiOnly(false)}>
              {t.all}
            </Toggle>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E6EBF2]">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#F5F7FA] text-left text-xs text-ink-muted">
                <th className="px-3.5 py-3 font-semibold">{t.colPlatform}</th>
                <th className="px-3.5 py-3 text-right font-semibold">{t.colOriginal}</th>
                <th className="px-3.5 py-3 text-right font-semibold">{t.colTHB}</th>
                <th className="px-3.5 py-3 text-right font-semibold">{t.colVsMine}</th>
                <th className="px-3.5 py-3 font-semibold">{t.colStock}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const diff = r.thb === null ? null : r.thb - data.my_selling_price;
                const isCheapest = cheapest?.seller === r.seller && cheapest.platform_id === r.platform_id;
                return (
                  <tr
                    key={`${r.platform_id}-${r.seller}`}
                    className={`border-t border-line-subtle ${isCheapest ? "bg-[#F0FDF4]" : ""}`}
                  >
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-2.5">
                        <PlatformBadge id={r.platform_id} name={r.platform} />
                        <div className="min-w-0">
                          <div className="font-semibold">{r.platform}</div>
                          <div className="truncate text-xs text-ink-muted">{r.seller}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-right text-ink-muted">
                      {r.price === null
                        ? "-"
                        : r.currency === "THB"
                          ? `฿${r.price}`
                          : `${r.price.toLocaleString("en-US")} ${r.currency}`}
                    </td>
                    <td className="px-3.5 py-3 text-right font-semibold">
                      {r.thb === null ? "-" : `${r.currency === "THB" ? "" : "≈"}฿${r.thb.toLocaleString("en-US")}`}
                    </td>
                    <td className={`px-3.5 py-3 text-right ${diff === null ? "" : diff < 0 ? "text-expense" : "text-income"}`}>
                      {diff === null ? "-" : `${diff > 0 ? "+" : diff < 0 ? "−" : ""}฿${Math.abs(diff).toLocaleString("en-US")}`}
                    </td>
                    <td className="px-3.5 py-3">
                      <Badge tone={r.stock === "มีสินค้า" ? "success" : r.stock === "สินค้าหมด" ? "warning" : "neutral"}>
                        {r.stock}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t.calcTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <NumberField label={t.cost} value={unitCost} onChange={setCost} />
          <NumberField label={t.sellPrice} value={price} onChange={setSellPrice} />
          <NumberField label={t.fee} value={feePct} onChange={setFeePct} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-line-subtle px-4 py-3">
            <div className="text-xs text-ink-muted">{t.feeBaht}</div>
            <div className="text-xl font-bold">฿{feeBaht.toFixed(2)}</div>
          </div>
          <div className="rounded-xl bg-navy px-4 py-3 text-white">
            <div className="text-xs text-[#CBD5E1]">{t.profit}</div>
            <div className="text-xl font-bold">฿{profit.toFixed(2)}</div>
            <div className="text-xs text-[#6EE7B7]">{t.margin.replace("{pct}", margin.toFixed(0))}</div>
          </div>
        </div>
        <p className="text-xs text-ink-muted">
          {t.vsMarket
            .replace("{count}", String(thaiAvailable.filter((c) => (c.price ?? 0) > price).length))
            .replace("{total}", String(thaiAvailable.length))}
        </p>
      </Card>
    </div>
  );
}
