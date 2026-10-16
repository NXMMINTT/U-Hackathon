"use client";

import Link from "next/link";

import { UBotLive } from "@/components/brand/UBotLive";
import { PendingCard } from "@/components/dashboard/PendingCard";
import { ProductThumb } from "@/components/dashboard/ProductThumb";
import { StatCard } from "@/components/dashboard/StatCard";
import { Note } from "@/components/decor/Note";
import { Ring } from "@/components/ui/Ring";
import { useOverview } from "@/hooks/dashboard/useOverview";
import { useTaxMeter } from "@/hooks/dashboard/useTaxMeter";
import { useTransactions } from "@/hooks/dashboard/useTransactions";
import { formatBaht, formatThaiMonthYear } from "@/lib/format";
import { vatThresholdDate } from "@/lib/vatThresholdDate";

const ZONE = {
  green: { label: "โซนเขียว · ยังห่างเพดาน", chip: "bg-[#E6F7EE] text-[#0F6B42]", ring: "#34C27A", mood: "happy", note: "ยังสบาย~", say: "ยอดขายยังห่างเพดาน VAT สบายใจได้ค่ะ" },
  yellow: { label: "โซนเหลือง · เริ่มวางแผน", chip: "bg-sun-soft text-sun-ink", ring: "#FFC83D", mood: "worried", note: "เริ่มใกล้แล้วนะ!", say: "แต่ยอดขายใกล้เพดาน VAT แล้วนะคะ" },
  red: { label: "โซนแดง · ใกล้ต้องจด VAT", chip: "bg-[#FDECEC] text-expense", ring: "#F26B5B", mood: "shocked", note: "ระวังๆ!", say: "ยอดขายใกล้ถึงเพดาน VAT มากแล้ว ควรเตรียมจด VAT ค่ะ" },
} as const;

const TIPS = [
  "กดยืนยันรายการที่รออยู่ด้วยนะคะ",
  "ส่งสลิปใน LINE แล้วหนูจดให้เอง",
  "เก็บใบเสร็จค่าวัตถุดิบไว้ หักภาษีได้ค่ะ",
  "อยากรู้ราคาคู่แข่ง ไปแท็บ Market Radar เลย",
];

const PRODUCT_TINTS = ["bg-[#FFE9E3] text-[#C2410C]", "bg-brand-soft text-brand", "bg-[#E6F7EE] text-income"];

/** This month at a glance: U-Bot's greeting, the VAT meter, income/expense/profit, best sellers and pending entries. */
export function ShopOverview() {
  const overview = useOverview();
  const meter = useTaxMeter();
  const transactions = useTransactions(20);
  const error = overview.error ?? meter.error;

  if (error) {
    return <p className="rounded-3xl bg-[#FDECEC] p-6 text-expense">โหลดข้อมูลร้านไม่สำเร็จ: {error.message}</p>;
  }
  if (!overview.data || !meter.data) {
    return <p className="rounded-3xl bg-white p-6 text-center text-ink-muted">กำลังโหลดข้อมูลร้าน…</p>;
  }

  const o = overview.data;
  const m = meter.data;
  const zone = ZONE[m.color];
  const profit = Number(o.net_profit);
  const reachDate = vatThresholdDate(m);
  const pending = (transactions.data ?? []).filter((t) => t.status === "pending");

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="U-Bot และมิเตอร์ภาษี" className="flex flex-wrap items-center gap-x-10 gap-y-7 rounded-[32px] bg-sky-deep p-6 md:p-9">
        <div className="flex min-w-0 flex-[1_1_480px] items-end gap-4">
          <UBotLive size={140} wave mood={zone.mood} tips={TIPS} bubbleSide="right" className="shrink-0 max-sm:hidden" />
          <div className="min-w-0 flex-1 rounded-3xl rounded-bl-md bg-white px-6 py-5 shadow-[0_10px_30px_rgba(26,111,214,.12)]">
            <div className="text-[15px] font-semibold text-brand">U-Bot</div>
            <p className="m-0 text-xl leading-normal md:text-[22px]">
              สวัสดีค่ะ {o.business_name} เดือนนี้{profit >= 0 ? "กำไร" : "ขาดทุน"}{" "}
              <b className={profit >= 0 ? "text-brand" : "text-expense"}>{formatBaht(Math.abs(profit))}</b> {zone.say}
            </p>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-5 rounded-[28px] bg-white px-6 py-5 max-sm:w-full md:rotate-1">
          <Note className="absolute -top-5 left-4 rounded-lg bg-sun px-2.5 py-0.5 text-[15px] !text-[#4A3500] shadow-md" tilt={-6}>
            {zone.note}
          </Note>
          <Ring ratio={Number(m.ratio)} color={zone.ring} size={150}>
            <div className="text-[38px] font-bold leading-none">{Math.round(Number(m.ratio) * 100)}%</div>
            <div className="text-[13px] text-ink-muted">ของเพดาน VAT</div>
          </Ring>
          <div className="flex flex-col gap-1.5">
            <span className={`self-start rounded-full px-3 py-0.5 text-sm font-bold ${zone.chip}`}>{zone.label}</span>
            <div className="text-xl font-semibold">{formatBaht(m.annual_income)}</div>
            <div className="text-[15px] text-ink-muted">
              จาก {formatBaht(m.threshold)} ในปี {m.year + 543}
              {reachDate && (
                <>
                  <br />
                  ถึงเพดานราว {formatThaiMonthYear(reachDate)}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="สรุปเดือนนี้" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
        <StatCard label="รายรับเดือนนี้" value={formatBaht(o.income)} />
        <StatCard label="รายจ่ายเดือนนี้" value={formatBaht(o.expense)} />
        <StatCard label="กำไรสุทธิ" value={formatBaht(o.net_profit)} highlight />
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-6">
        <section aria-label="สินค้าขายดี" className="flex flex-col gap-4 rounded-[28px] bg-white p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="m-0 text-[21px] font-semibold">ขายดีเดือนนี้</h2>
            <Link href="/stock" className="text-[15px] font-semibold no-underline">
              ดูสต็อก
            </Link>
          </div>
          {o.top_products.length === 0 && <p className="m-0 text-ink-muted">ยังไม่มียอดขายสินค้าเดือนนี้</p>}
          {o.top_products.slice(0, 3).map((p, i) => (
            <div key={p.product_id} className="flex items-center gap-3.5">
              <ProductThumb name={p.name} rank={i + 1} tint={PRODUCT_TINTS[i]} imageUrl={p.image_url} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-[15px] text-ink-muted">
                  ขาย {Number(p.quantity_sold).toLocaleString("en-US")} {p.unit} · เหลือ {Number(p.stock_qty).toLocaleString("en-US")}
                </div>
              </div>
              <b className="font-semibold">{formatBaht(p.revenue)}</b>
            </div>
          ))}
        </section>

        <PendingCard pending={pending} />
      </div>

      <Link
        href="/market"
        className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border-2 border-dashed border-sky-line bg-white px-7 py-6 text-ink no-underline"
      >
        <span>
          <span className="block text-xl font-semibold">คู่แข่งขายสินค้าแบบเดียวกับคุณเท่าไหร่?</span>
          <span className="text-[15px] text-ink-muted">ให้ U-Bot ช่วยหาราคาที่ขายออกและกำไรดีที่สุด</span>
        </span>
        <span className="inline-flex min-h-[48px] items-center rounded-full bg-sun px-6 font-bold text-[#4A3500]">ลองฟรี 7 วัน</span>
      </Link>
    </div>
  );
}
