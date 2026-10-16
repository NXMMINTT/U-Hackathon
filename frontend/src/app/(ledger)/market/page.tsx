"use client";

import { Note } from "@/components/doodles";
import { UBotLive } from "@/components/playful";
import {
  type CompetitorPrices,
  useCompetitorPrices,
  useEuArbitrage,
  useKeywordVolume,
  useMarketTrend,
  useSponsors,
  useUBotInsights,
} from "@/hooks/useMarket";
import { formatBaht } from "@/lib/format";
import { platformLogo } from "@/lib/market";

const IN_STOCK = "มีสินค้า";
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

/** Competitor price section (spec 2.2): summary cards, a per-platform bar chart and two comparison tables. */
function PriceStrip({ prices: p, suggested }: { prices: CompetitorPrices; suggested: number | undefined }) {
  const thai = p.competitors.filter((c) => c.currency === "THB" && c.price !== null) as (CompetitorPrices["competitors"][number] & { price: number })[];
  const sorted = [...thai].sort((a, b) => a.price - b.price);
  const inStock = thai.filter((c) => c.stock === IN_STOCK).map((c) => c.price).sort((a, b) => a - b);
  const median = inStock.length ? quantile(inStock, 0.5) : p.price_distribution_thb.median;
  const diffFromMine = sorted.map((c) => ({ ...c, diff: Math.round(c.price - p.my_selling_price) }));
  const cheaper = diffFromMine.filter((c) => c.diff < 0);
  const pricier = diffFromMine.filter((c) => c.diff >= 0).sort((a, b) => b.price - a.price);

  return (
    <section aria-label="ราคาคู่แข่ง" className="flex flex-col gap-5 rounded-[28px] bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-[22px] font-semibold">คู่แข่งขายเท่าไหร่</h2>
        <span className="text-[15px] text-ink-muted">
          {thai.length} ร้านในไทย · ราคากลาง {formatBaht(median)}
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-4">
        <SummaryCard icon={<TargetIcon />} label="ราคาที่แนะนำ" value={suggested !== undefined ? formatBaht(suggested) : "—"} />
        <SummaryCard icon={<CoinIcon />} label="ต้นทุนสินค้า" value={formatBaht(p.my_cost_price)} />
        <SummaryCard icon={<ChartIcon />} label="ราคากลางตลาด" value={formatBaht(median)} />
        <SummaryCard
          icon={<TrendIcon />}
          label="ราคาของร้านคุณ"
          value={formatBaht(p.my_selling_price)}
          sub={`ส่วนต่างจากราคากลาง ${p.my_selling_price - median >= 0 ? "+" : ""}${formatBaht(p.my_selling_price - median)}`}
          accent
        />
      </div>

      <PriceBarChart
        competitors={sorted}
        myPrice={p.my_selling_price}
        suggested={suggested}
        costPrice={p.my_cost_price}
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-5 rounded-[22px] bg-brand-tint/60 p-5">
        <CompareTable title="ราคาถูก/แพลตฟอร์ม" rows={cheaper} mySellingPrice={p.my_selling_price} />
        <CompareTable title="ราคาสูง/แพลตฟอร์ม" rows={pricier} mySellingPrice={p.my_selling_price} />
      </div>
    </section>
  );
}

function SummaryCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-brand-soft/60 px-4 py-4">
      <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-brand">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[15px] text-ink-muted">{label}</div>
        <div className={`text-[24px] font-bold leading-tight ${accent ? "text-brand" : "text-navy"}`}>{value}</div>
        {sub && <div className={`text-sm font-semibold ${sub.startsWith("-") ? "text-expense" : "text-[#0F6B42]"}`}>{sub}</div>}
      </div>
    </div>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function TargetIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

function CoinIcon() {
  return (
    <Icon>
      <circle cx="9" cy="9" r="6" />
      <path d="M14.2 5.2a6 6 0 1 1-8.99 8.9" />
      <path d="M9 6v6M7 7.5h4M7 10.5h4" strokeWidth="1.4" />
    </Icon>
  );
}

function ChartIcon() {
  return (
    <Icon>
      <path d="M4 20h16" />
      <rect x="5" y="11" width="3.5" height="6" rx="1" />
      <rect x="10.25" y="7" width="3.5" height="10" rx="1" />
      <rect x="15.5" y="4" width="3.5" height="13" rx="1" />
    </Icon>
  );
}

function TrendIcon() {
  return (
    <Icon>
      <path d="M3 17l6-6 4 4 7-8" />
      <path d="M15 7h5v5" />
    </Icon>
  );
}

const CHEAPEST = 0;

function barColor(i: number, total: number, stock: string, isMine: boolean) {
  if (isMine) return "bg-navy";
  if (stock !== IN_STOCK) return "bg-[#D3D9E3]";
  if (i === CHEAPEST) return "bg-[#22B862]";
  if (i === total - 1) return "bg-[#F05461]";
  return "bg-[#79AEF3]";
}

/** Bar chart of every competitor's price, with the cost line and the suggested-price band overlaid. */
function PriceBarChart({
  competitors,
  myPrice,
  suggested,
  costPrice,
}: {
  competitors: (CompetitorPrices["competitors"][number] & { price: number })[];
  myPrice: number;
  suggested: number | undefined;
  costPrice: number;
}) {
  const total = competitors.length + 1;
  const chartH = 260;
  const max = Math.max(myPrice, costPrice, ...(suggested ? [suggested + 5] : []), ...competitors.map((c) => c.price));
  const top = Math.ceil((max + 5) / 20) * 20;
  const h = (v: number) => (v / top) * (chartH - 40);
  const ticks = Array.from({ length: Math.floor(top / 20) + 1 }, (_, i) => i * 20);
  const band = suggested !== undefined ? { lo: h(suggested - 4), hi: h(suggested + 4) } : null;

  const Item = ({
    label,
    price,
    mine,
    index,
    stock,
  }: {
    label: string;
    price: number;
    mine?: boolean;
    index: number;
    stock: string;
  }) => (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2" title={`${label} ${formatBaht(price)}${stock === IN_STOCK ? "" : " (ของหมด)"}`}>
      <span className={`text-[15px] font-bold ${mine ? "text-navy" : stock === IN_STOCK ? "text-ink-body" : "text-ink-muted"}`}>{formatBaht(price)}</span>
      <div className="flex w-full items-end justify-center" style={{ height: chartH - 30 }}>
        <div
          className={`w-full max-w-[58px] rounded-t-xl transition-[height] ${barColor(index, total, stock, !!mine)} ${mine ? "ring-2 ring-brand ring-offset-2 ring-offset-white" : ""}`}
          style={{ height: Math.max(h(price), 6) }}
        />
      </div>
      {/* fixed-height caption block so every bar starts from the same baseline */}
      <div className="flex h-[64px] w-[86px] flex-col items-center gap-0.5">
        <PlatformLogo id={label.split("\n")[0]} name={label.split("\n")[0]} seller={label.split("\n")[1]} mine={mine} />
        {stock !== IN_STOCK && <span className="text-[12px] text-ink-muted">ของหมด</span>}
      </div>
    </div>
  );

  return (
    <div className="relative rounded-[22px] bg-white px-2 pt-2">
      {/* suggested price band */}
      {band && (
        <>
          <div className="absolute inset-x-10 rounded-lg bg-[#DCEBFF]/70" style={{ bottom: 92 + band.lo, height: band.hi - band.lo }} />
          <span className="absolute right-0 z-10 -translate-y-1/2 rounded-full bg-[#DCEBFF] px-2.5 py-0.5 text-[13px] font-bold text-brand" style={{ bottom: 92 + band.hi }}>
            ราคาแนะนำ {formatBaht(suggested!)}
          </span>
        </>
      )}
      {/* cost dashed line */}
      <div className="absolute left-8 right-0 border-t-2 border-dashed border-[#F5A54B]" style={{ bottom: 92 + h(costPrice) }} />
      <span
        className="absolute z-10 -translate-y-1/2 rounded-full bg-[#FFE7C7] px-2.5 py-0.5 text-[13px] font-bold text-[#9A5B12]"
        style={{ bottom: 92 + h(costPrice), right: 0 }}
      >
        ต้นทุน {formatBaht(costPrice)}
      </span>

      <div className="flex gap-3">
        {/* Y axis */}
        <div className="relative w-12 shrink-0 text-right" style={{ height: chartH - 30 }}>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2 text-[13px] text-ink-muted" style={{ bottom: h(t) }}>
              ฿{t}
            </span>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1.5 border-l border-line pl-1">
          {competitors.map((c, i) => (
            <Item key={`${c.platform}-${c.seller}`} label={`${c.platform}\n${c.seller}`} price={c.price} index={i} stock={c.stock} />
          ))}
          <Item label="ร้านคุณ" price={myPrice} mine index={total - 1} stock={IN_STOCK} />
        </div>
      </div>
    </div>
  );
}

function CompareTable({
  title,
  rows,
  mySellingPrice,
}: {
  title: string;
  rows: (CompetitorPrices["competitors"][number] & { price: number; diff: number })[];
  mySellingPrice: number;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="rounded-[18px] bg-white p-4">
      <div className="mb-2 grid grid-cols-[minmax(0,1fr)_72px_168px] gap-x-4 text-[15px] font-semibold text-ink-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-8 w-8 shrink-0" />
          {title}
        </span>
        <span className="text-right">ราคา</span>
        <span className="text-center">ส่วนต่างจากร้านคุณ</span>
      </div>
      <ul className="m-0 flex list-none flex-col divide-y divide-line p-0">
        {rows.map((c) => (
          <li key={`${c.platform}-${c.seller}`} className="grid grid-cols-[minmax(0,1fr)_72px_168px] items-center gap-x-4 py-2.5">
            <span className="flex min-w-0 items-center gap-3 truncate font-medium">
              <PlatformLogo id={c.platform_id} name={c.platform} compact />
              {c.seller}
              {c.stock !== IN_STOCK && <span className="text-[13px] text-ink-muted">ของหมด</span>}
            </span>
            <b className="text-right tabular-nums">{formatBaht(c.price)}</b>
            <b className={`text-center tabular-nums ${c.diff < 0 ? "text-expense" : "text-[#0F6B42]"}`}>{c.diff > 0 ? `+${c.diff}` : c.diff}</b>
          </li>
        ))}
        <li className="grid grid-cols-[minmax(0,1fr)_72px_168px] items-center gap-x-4 bg-brand-soft/50 py-2.5 pl-2">
          <span className="flex items-center gap-3 font-bold text-navy">
            <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-navy text-[13px] font-bold text-white">คุณ</span>
            ร้านคุณ
          </span>
          <b className="text-right tabular-nums">{formatBaht(mySellingPrice)}</b>
          <b className="text-center tabular-nums">0</b>
        </li>
      </ul>
    </div>
  );
}

/** Platform badge (fixed 32px square, white tile style so every logo renders the same size)
 *  with the platform/seller caption; falls back to a letter badge when there's no asset. */
function PlatformLogo({
  id,
  name,
  seller,
  mine,
  compact,
}: {
  id: string;
  name: string;
  seller?: string;
  mine?: boolean;
  /** Table rows: hide the text caption, show only the square badge. */
  compact?: boolean;
}) {
  const badge = (() => {
    if (mine)
      return (
        <span aria-hidden="true" className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-navy text-[13px] font-bold text-white">คุณ</span>
      );
    const src = platformLogo(id) ?? platformLogo(name);
    return src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" aria-hidden="true" className="h-8 w-8 flex-none rounded-[10px] border border-line bg-white object-contain p-1" />
    ) : (
      <span aria-hidden="true" className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-[#E3EEFB] text-sm font-bold text-brand">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  })();

  if (compact) return badge;
  return (
    <span className="flex max-w-[86px] flex-col items-center gap-0.5">
      {badge}
      {!mine && <span className="w-[86px] truncate text-center text-[12px] leading-4 text-ink-body">{name}</span>}
      {!mine && seller && <span className="w-[86px] truncate text-center text-[12px] leading-4 text-ink-muted">{seller}</span>}
    </span>
  );
}
