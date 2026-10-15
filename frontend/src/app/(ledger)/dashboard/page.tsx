"use client";

import Link from "next/link";

import { LineAddFriendButton, Ring } from "@/components/brand";
import { Note } from "@/components/doodles";
import { UBotLive } from "@/components/playful";
import { type TaxMeter, type TransactionItem, useOverview, useTaxMeter, useTransactionActions, useTransactions } from "@/hooks/useDashboard";
import { formatBaht, formatThaiMonthYear } from "@/lib/format";
import { productPhoto } from "@/lib/market";

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

/** When this year's income reaches the VAT threshold at the pace so far, or null if not this year. */
function thresholdDate(meter: TaxMeter, today = new Date()): Date | null {
  const income = Number(meter.annual_income);
  const threshold = Number(meter.threshold);
  if (income >= threshold) return today;
  const yearStart = new Date(today.getFullYear(), 0, 1);
  const days = Math.max(1, (today.getTime() - yearStart.getTime()) / 86_400_000);
  const perDay = income / days;
  if (perDay <= 0) return null;
  const date = new Date(today.getTime() + ((threshold - income) / perDay) * 86_400_000);
  return date.getFullYear() === today.getFullYear() || date.getFullYear() === today.getFullYear() + 1 ? date : null;
}

const PRODUCT_TINTS = ["bg-[#FFE9E3] text-[#C2410C]", "bg-brand-soft text-brand", "bg-[#E6F7EE] text-income"];

export default function MyBusinessPage() {
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
  const reachDate = thresholdDate(m);
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
        <Stat label="รายรับเดือนนี้" value={formatBaht(o.income)} />
        <Stat label="รายจ่ายเดือนนี้" value={formatBaht(o.expense)} />
        <Stat label="กำไรสุทธิ" value={formatBaht(o.net_profit)} highlight />
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
              <ProductThumb name={p.name} rank={i + 1} tint={PRODUCT_TINTS[i]} />
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

/** Real product photo when there is one (public/products/CREDITS.md), else the rank on a tinted tile. */
function ProductThumb({ name, rank, tint }: { name: string; rank: number; tint: string }) {
  const photo = productPhoto(name);
  return (
    <span className="relative shrink-0">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="h-[52px] w-[52px] rounded-[18px] object-cover" />
      ) : (
        <span className={`grid h-[52px] w-[52px] place-items-center rounded-[18px] text-lg font-bold ${tint}`}>{rank}</span>
      )}
      {photo && (
        <span className="absolute -left-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-sun font-hand text-sm font-bold text-[#4A3500]">{rank}</span>
      )}
    </span>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-[26px] px-7 py-6 ${highlight ? "bg-brand text-white" : "bg-white"}`}>
      <div className={`text-[15px] ${highlight ? "text-sky-deep" : "text-ink-muted"}`}>{label}</div>
      <div className="text-[32px] font-semibold leading-snug">{value}</div>
    </div>
  );
}

function PendingCard({ pending }: { pending: TransactionItem[] }) {
  const { confirm } = useTransactionActions();
  const first = pending[0];

  return (
    <section aria-label="รอยืนยัน" className="flex flex-col gap-4 rounded-[28px] bg-white p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-[21px] font-semibold">รอคุณยืนยัน{pending.length > 1 ? ` (${pending.length})` : ""}</h2>
        <Link href="/transactions" className="text-[15px] font-semibold no-underline">
          ดูทั้งหมด
        </Link>
      </div>
      {first ? (
        <div className="flex flex-col gap-3 rounded-[22px] bg-brand-tint p-5">
          <div>
            <div className="font-semibold">{first.description ?? first.product_name ?? (first.type === "income" ? "รายรับ" : "รายจ่าย")}</div>
            <div className="text-[15px] text-ink-muted">
              {first.type === "income" ? "รายรับ" : "รายจ่าย"} {formatBaht(first.amount)} · จาก LINE
            </div>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              disabled={confirm.isPending}
              onClick={() => confirm.mutate(first.id)}
              className="min-h-[46px] flex-1 rounded-full bg-brand font-semibold text-white disabled:opacity-60"
            >
              ยืนยัน
            </button>
            <Link
              href={`/transactions?edit=${first.id}`}
              className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-full border-2 border-[#C7DEFC] bg-white font-semibold text-ink no-underline"
            >
              แก้ไข
            </Link>
          </div>
          {confirm.error && <p className="m-0 text-sm text-expense">{confirm.error.message}</p>}
        </div>
      ) : (
        <p className="m-0 text-ink-muted">ไม่มีรายการค้าง ส่งสลิปหรืออัดเสียงใน LINE แล้วรายการจะมารอตรงนี้</p>
      )}
      <LineAddFriendButton label="ส่งสลิปหรืออัดเสียงใน LINE" className="justify-center" />
    </section>
  );
}
