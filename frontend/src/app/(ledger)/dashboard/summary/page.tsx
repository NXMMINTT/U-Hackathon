"use client";

import Link from "next/link";
import { useState } from "react";

import { ProductThumb } from "@/components/dashboard/ProductThumb";
import { CategoryBreakdown } from "@/components/summary/CategoryBreakdown";
import { MonthSummaryCards } from "@/components/summary/MonthSummaryCards";
import { MonthTransactionList } from "@/components/summary/MonthTransactionList";
import { useOverview } from "@/hooks/dashboard/useOverview";
import { formatBaht } from "@/lib/format";

const TABS = [
  { id: "overview", label: "ภาพรวม" },
  { id: "income", label: "รายรับ" },
  { id: "expense", label: "รายจ่าย" },
  { id: "products", label: "สินค้า" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const MONTHS_TH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const PRODUCT_TINTS = ["bg-[#FFE9E3] text-[#C2410C]", "bg-brand-soft text-brand", "bg-[#E6F7EE] text-income"];

/** "YYYY-MM" for a year and a 0-based month (which may run past 0..11). */
function monthKey(year: number, month: number): string {
  const d = new Date(year, month, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function BestSellers({ month }: { month: string }) {
  const { data, isLoading } = useOverview(month);
  return (
    <section className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-[18px] font-bold text-navy">สินค้าขายดีเดือนนี้</h2>
        <Link href="/stock" className="text-[14px] font-semibold text-brand no-underline">
          ดูสต็อก &gt;
        </Link>
      </div>
      {isLoading && <p className="m-0 text-ink-muted">กำลังโหลด…</p>}
      {data?.top_products.length === 0 && <p className="m-0 text-ink-muted">ยังไม่มียอดขายสินค้าในเดือนนี้</p>}
      {data?.top_products.map((p, i) => (
        <div key={p.product_id} className="flex items-center gap-3.5">
          <ProductThumb name={p.name} rank={i + 1} tint={PRODUCT_TINTS[i % PRODUCT_TINTS.length]} imageUrl={p.image_url} />
          <div className="min-w-0 flex-1">
            <div className="font-semibold">{p.name}</div>
            <div className="text-[14px] text-ink-muted">
              ขาย {Number(p.quantity_sold).toLocaleString("en-US")} {p.unit} · เหลือ {Number(p.stock_qty).toLocaleString("en-US")}
            </div>
          </div>
          <b>{formatBaht(p.revenue)}</b>
        </div>
      ))}
    </section>
  );
}

export default function SummaryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const current = monthKey(year, month);
  const previous = monthKey(year, month - 1);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (isCurrentMonth) return;
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div role="tablist" aria-label="หมวดสรุป" className="flex gap-2 rounded-full bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-full py-2.5 text-[14px] font-bold transition-all ${
              activeTab === tab.id ? "bg-brand text-white shadow-sm" : "text-ink-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="เดือนก่อน"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-muted shadow-sm"
        >
          ‹
        </button>
        <span className="text-[16px] font-bold text-navy">
          {MONTHS_TH[month]} {year + 543}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={isCurrentMonth}
          aria-label="เดือนถัดไป"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-muted shadow-sm disabled:opacity-40"
        >
          ›
        </button>
      </div>

      {activeTab === "overview" && (
        <>
          <MonthSummaryCards month={current} previousMonth={previous} />
          <CategoryBreakdown month={current} type="expense" />
        </>
      )}
      {(activeTab === "income" || activeTab === "expense") && (
        <>
          <CategoryBreakdown key={activeTab} month={current} type={activeTab} />
          <MonthTransactionList month={current} type={activeTab} />
        </>
      )}
      {activeTab === "products" && <BestSellers month={current} />}
    </div>
  );
}
