"use client";

import { Note } from "@/components/decor/Note";
import { UBotLive } from "@/components/brand/UBotLive";
import { useCompetitorPrices } from "@/hooks/market/useCompetitorPrices";
import { useEuArbitrage } from "@/hooks/market/useEuArbitrage";
import { useKeywordVolume } from "@/hooks/market/useKeywordVolume";
import { useMarketTrend } from "@/hooks/market/useMarketTrend";
import { useSponsors } from "@/hooks/market/useSponsors";
import { useUBotInsights } from "@/hooks/market/useUBotInsights";
import type { CompetitorPrices } from "@/types/market";
import { formatBaht } from "@/lib/format";

const IN_STOCK = "มีสินค้า";
const MIN_MARGIN = 1.3; // same floor as backend/app/routers/ubot_insights.py
const EUR_TO_THB = 39; // approximate demo rate, not live — the UI says "ประมาณ"

/** Market Radar overview (premium lock and trial badge live in layout.tsx). */
export default function MarketRadarPage() {
  const prices = useCompetitorPrices();
  const productId = prices.data?.product_id;
  const ubot = useUBotInsights(productId);
  const trend = useMarketTrend();
  const keywords = useKeywordVolume();
  const eu = useEuArbitrage();
  const sponsors = useSponsors(productId);

  if (prices.error) return <p className="rounded-3xl bg-[#FDECEC] p-6 text-expense">โหลดข้อมูลตลาดไม่สำเร็จ: {prices.error.message}</p>;
  if (!prices.data) return <p className="rounded-3xl bg-white p-6 text-center text-ink-muted">กำลังโหลดข้อมูลตลาด…</p>;

  const p = prices.data;
  const suggested = ubot.data?.suggested_price;
  const euItem = eu.data?.find((e) => e.product_id === p.product_id);
  const shares = platformShares(trend.data?.series ?? []);
  const topKeywords = [...(keywords.data ?? [])].sort((a, b) => b.search_volume - a.search_volume).slice(0, 4);
  const sponsor = sponsors.data?.[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="m-0 text-[15px] text-ink-muted">วิเคราะห์ตลาดของ</p>
        <h2 className="m-0 text-2xl font-bold leading-snug md:text-[28px]">{p.product_name}</h2>
      </div>

      <section aria-label="U-Bot แนะนำราคา" className="flex flex-wrap items-center gap-x-9 gap-y-6 rounded-[32px] bg-sky-deep p-6 md:p-9">
        <UBotLive
          pose="radar"
          size={140}
          bubbleSide="right"
          tips={["หนูแอบส่องคู่แข่งมาให้แล้วค่ะ", "จุดน้ำเงินเข้มในกราฟคือร้านคุณนะ", "ร้านที่ของหมด คือโอกาสของเรา!"]}
          className="shrink-0 max-sm:hidden"
        />
        <div className="min-w-0 flex-[1_1_440px]">
          <div className="text-[15px] font-semibold text-brand">U-Bot แนะนำวันนี้</div>
          {ubot.data ? (
            <>
              <p className="m-0 text-[22px] leading-normal md:text-[25px]">{ubot.data.reason}</p>
              {ubot.data.insights.length > 0 && (
                <ul className="mb-0 mt-3 flex flex-col gap-1 pl-5 text-ink-body">
                  {ubot.data.insights.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="m-0 text-[22px] text-ink-muted">{ubot.error ? `U-Bot ยังตอบไม่ได้: ${ubot.error.message}` : "U-Bot กำลังวิเคราะห์ราคาคู่แข่ง…"}</p>
          )}
        </div>
        {suggested !== undefined && (
          <div className="relative flex flex-col items-center gap-1 rounded-[26px] bg-white px-6 py-5 md:-rotate-2">
            <Note className="absolute -top-5 right-2 rounded-lg bg-sun px-2.5 py-0.5 text-[15px] !text-[#4A3500] shadow-md" tilt={6}>
              ราคานี้กำลังดี!
            </Note>
            <div className="text-sm text-ink-muted">ราคาแนะนำ</div>
            <div className="text-[34px] font-bold leading-tight text-brand">{formatBaht(suggested)}</div>
            <div className="text-sm text-ink-muted">กำไร {formatBaht(suggested - p.my_cost_price)} ต่อชิ้น</div>
          </div>
        )}
      </section>

      <PriceStrip prices={p} suggested={suggested} />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,330px),1fr))] gap-5">
        <section aria-label="ขายที่ไหนดี" className="flex flex-col gap-3 rounded-[28px] bg-white p-6">
          <h2 className="m-0 text-xl font-semibold">ขายที่ไหนดี</h2>
          <p className="m-0 text-[15px] text-ink-muted">ยอดขายสินค้าแบบเดียวกันในตลาด แยกตามแพลตฟอร์ม</p>
          {shares.slice(0, 4).map((s, i) => (
            <div key={s.platform}>
              <div className="flex justify-between">
                <span>{s.platform}</span>
                <b>{s.pct}%</b>
              </div>
              <div className="h-2.5 rounded-full bg-brand-soft">
                <div className={`h-full rounded-full ${i < 2 ? "bg-brand" : "bg-brand-light"}`} style={{ width: `${(s.pct / shares[0].pct) * 100}%` }} />
              </div>
            </div>
          ))}
        </section>

        <section aria-label="คำค้นยอดฮิต" className="flex flex-col gap-3 rounded-[28px] bg-white p-6">
          <h2 className="m-0 text-xl font-semibold">ลูกค้าค้นหาคำว่า</h2>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {topKeywords.map((k) => (
              <li key={`${k.keyword}-${k.platform}`} className="rounded-full bg-brand-soft px-3.5 py-1.5 font-semibold">
                {k.keyword}
                {k.trend === "up" && <span className="text-brand"> ↑</span>}
                <span className="ml-1.5 text-sm font-normal text-ink-muted">{(k.search_volume / 1000).toFixed(1)}k</span>
              </li>
            ))}
          </ul>
          <p className="m-0 text-[15px] text-ink-muted">↑ = กำลังมาแรง ใส่ในชื่อสินค้าหรือโฆษณาได้เลย</p>
        </section>

        {euItem && (
          <section aria-label="ส่งออกยุโรป" className="flex flex-col gap-3 rounded-[28px] bg-white p-6">
            <h2 className="m-0 text-xl font-semibold">ส่งไปยุโรปได้ไหม</h2>
            <p className="m-0">
              {euItem.eu_market.region} ขายปลีกราว <b>€{euItem.eu_market.avg_retail_price_eur.toFixed(2)}</b> (ประมาณ{" "}
              {formatBaht(euItem.eu_market.avg_retail_price_eur * EUR_TO_THB)}) ราคาส่งที่แนะนำ €
              {euItem.eu_market.suggested_wholesale_price_eur.toFixed(2)}
            </p>
            <span className="self-start rounded-full bg-[#E6F7EE] px-3 py-1 text-sm font-bold text-[#0F6B42]">
              ความต้องการ {euItem.eu_market.demand_score}/100
            </span>
          </section>
        )}
      </div>

      {sponsor && (
        <section aria-label="ผู้สนับสนุน" className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[28px] border-2 border-[#FFE7A3] bg-white px-6 py-5">
          <span className="rounded-full bg-sun-soft px-3 py-0.5 text-[13px] font-bold text-sun-ink">ผู้สนับสนุน</span>
          <div className="min-w-0 flex-[1_1_360px]">
            <div className="font-semibold">
              {sponsor.sponsor_name} · {sponsor.product_name} {formatBaht(sponsor.price)}/{sponsor.unit}
            </div>
            <div className="text-[15px] text-ink-muted">{sponsor.description}</div>
          </div>
          <a href={sponsor.cta_link} className="inline-flex min-h-[46px] items-center rounded-full bg-brand-soft px-5 font-semibold no-underline">
            ดูข้อเสนอ
          </a>
        </section>
      )}
    </div>
  );
}

function platformShares(series: { platform: string; points: { units_sold: number }[] }[]) {
  const totals = series.map((s) => ({ platform: s.platform, units: s.points.reduce((sum, pt) => sum + pt.units_sold, 0) }));
  const all = totals.reduce((sum, t) => sum + t.units, 0) || 1;
  return totals.map((t) => ({ platform: t.platform, pct: Math.round((t.units / all) * 100) })).sort((a, b) => b.pct - a.pct);
}

function quantile(sorted: number[], q: number) {
  const i = (sorted.length - 1) * q;
  const lo = Math.floor(i);
  return sorted[lo] + (sorted[Math.ceil(i)] - sorted[lo]) * (i - lo);
}

/** Competitor price strip (spec 2.2): Thai competitors as dots, the shop's real cost and price pinned on the same axis. */
function PriceStrip({ prices: p, suggested }: { prices: CompetitorPrices; suggested: number | undefined }) {
  const thai = p.competitors.filter((c) => c.currency === "THB" && c.price !== null) as (CompetitorPrices["competitors"][number] & { price: number })[];
  const inStock = thai.filter((c) => c.stock === IN_STOCK).map((c) => c.price).sort((a, b) => a - b);
  const values = [...thai.map((c) => c.price), p.my_cost_price, p.my_selling_price, ...(suggested ? [suggested] : [])];
  const lo = Math.floor((Math.min(...values) - 5) / 10) * 10;
  const hi = Math.ceil((Math.max(...values) + 5) / 10) * 10;
  const x = (v: number) => ((v - lo) / (hi - lo)) * 100;
  const zone = inStock.length >= 2 ? [Math.max(quantile(inStock, 0.25), p.my_cost_price * MIN_MARGIN), quantile(inStock, 0.75)] : null;
  const median = inStock.length ? quantile(inStock, 0.5) : null;

  // stack dots that would overlap
  const placed: { x: number; lane: number }[] = [];
  const dots = [...thai]
    .sort((a, b) => a.price - b.price)
    .map((c) => {
      const cx = x(c.price);
      const lane = placed.filter((d) => Math.abs(d.x - cx) < 2.5).length;
      placed.push({ x: cx, lane });
      return { ...c, cx, lane };
    });
  const ticks = Array.from({ length: Math.floor((hi - lo) / 20) + 1 }, (_, i) => lo + i * 20);

  return (
    <section aria-label="ราคาคู่แข่ง" className="flex flex-col gap-4 rounded-[28px] bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-[22px] font-semibold">คู่แข่งขายเท่าไหร่</h2>
        <span className="text-[15px] text-ink-muted">
          {thai.length} ร้านในไทย{median !== null && ` · ราคากลาง ${formatBaht(median)}`}
        </span>
      </div>

      <div className="relative mx-2 h-[180px]" aria-hidden="true">
        {zone && <div className="absolute bottom-10 top-7 rounded-2xl bg-[#E3F0FF]" style={{ left: `${x(zone[0])}%`, width: `${x(zone[1]) - x(zone[0])}%` }} />}
        <div className="absolute bottom-10 left-0 right-0 h-1 rounded-full bg-brand-soft" />
        <Pin at={x(p.my_cost_price)} label={`ต้นทุน ${formatBaht(p.my_cost_price)}`} className="bg-[#FFE9E3] text-[#9A3412]" line="bg-[#F2A48E]" />
        {suggested !== undefined && <Pin at={x(suggested)} label={`แนะนำ ${formatBaht(suggested)}`} className="bg-brand text-white" line="bg-brand" />}
        {dots.map((d) => (
          <span
            key={`${d.platform}-${d.seller}`}
            title={`${d.platform} · ${d.seller} ${formatBaht(d.price)}${d.stock === IN_STOCK ? "" : " (ของหมด)"}`}
            className={`absolute h-[22px] w-[22px] -translate-x-1/2 rounded-full ${d.stock === IN_STOCK ? "bg-brand-light" : "border-[3px] border-dashed border-brand-light bg-white"}`}
            style={{ left: `${d.cx}%`, bottom: 50 + d.lane * 26 }}
          />
        ))}
        <span
          className="absolute h-[26px] w-[26px] -translate-x-1/2 rounded-full border-[3px] border-white bg-navy shadow-[0_0_0_2px_#0B1F4D]"
          style={{ left: `${x(p.my_selling_price)}%`, bottom: 48 }}
        />
        {ticks.map((t) => (
          <span key={t} className="absolute bottom-2 -translate-x-1/2 text-sm text-ink-muted" style={{ left: `${x(t)}%` }}>
            ฿{t}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-ink-body">
        <Legend dot="bg-brand-light">คู่แข่ง</Legend>
        <Legend dot="border-2 border-dashed border-brand-light">ของหมด</Legend>
        <Legend dot="bg-navy">ร้านคุณ {formatBaht(p.my_selling_price)}</Legend>
        {zone && <Legend dot="w-[22px] rounded-md bg-[#E3F0FF]">ช่วงราคากลางที่ยังกำไรเกิน 30%</Legend>}
      </div>

      <details className="rounded-2xl bg-brand-tint px-5 py-3">
        <summary className="cursor-pointer font-semibold">ดูรายชื่อร้านคู่แข่ง</summary>
        <ul className="mb-1 mt-3 flex list-none flex-col gap-1.5 p-0">
          {dots.map((d) => (
            <li key={`${d.platform}-${d.seller}`} className="flex justify-between gap-3">
              <span>
                {d.platform} · {d.seller}
                {d.stock !== IN_STOCK && <span className="text-expense"> · ของหมด</span>}
              </span>
              <b>{formatBaht(d.price)}</b>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

function Pin({ at, label, className, line }: { at: number; label: string; className: string; line: string }) {
  return (
    <>
      <span className={`absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-bold ${className}`} style={{ left: `${at}%` }}>
        {label}
      </span>
      <span className={`absolute bottom-10 top-8 w-[3px] -translate-x-1/2 rounded ${line}`} style={{ left: `${at}%` }} />
    </>
  );
}

function Legend({ dot, children }: { dot: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3.5 w-3.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
}
