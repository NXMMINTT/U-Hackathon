"use client";

import Link from "next/link";
import { useState } from "react";

import { UBot } from "@/components/brand/UBot";
import { useOverview } from "@/hooks/dashboard/useOverview";
import { formatBaht } from "@/lib/format";

const TABS = [
  { id: "overview", label: "ภาพรวม" },
  { id: "income", label: "รายรับ" },
  { id: "expense", label: "รายจ่าย" },
  { id: "products", label: "สินค้า" },
] as const;

const MONTHS_TH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const EXPENSE_CATEGORIES = [
  { label: "อาหาร", icon: "🍽️", color: "bg-[#FF9800]" },
  { label: "วัตถุดิบ / สินค้า", icon: "🛒", color: "bg-[#2196F3]" },
  { label: "ขนส่ง", icon: "🚚", color: "bg-[#FF9800]" },
  { label: "ค่าที่พัก / ค่าเช่า", icon: "🏠", color: "bg-[#4CAF50]" },
  { label: "อื่นๆ", icon: "•••", color: "bg-[#9E9E9E]" },
];

export default function SummaryPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { data: overview, isLoading, error } = useOverview();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const income = overview ? Number(overview.income) : 0;
  const expense = overview ? Number(overview.expense) : 0;
  const profit = overview ? Number(overview.net_profit) : 0;

  const mockCategories = [
    { label: "อาหาร", icon: "🍽️", amount: 2850, pct: 39, color: "bg-[#FF9800]" },
    { label: "วัตถุดิบ / สินค้า", icon: "🛒", amount: 1920, pct: 27, color: "bg-[#2196F3]" },
    { label: "ขนส่ง", icon: "🚚", amount: 980, pct: 14, color: "bg-[#FFA726]" },
    { label: "ค่าที่พัก / ค่าเช่า", icon: "🏠", amount: 800, pct: 11, color: "bg-[#66BB6A]" },
    { label: "อื่นๆ", icon: "•••", amount: 680, pct: 9, color: "bg-[#BDBDBD]" },
  ];

  if (error) {
    return <p className="rounded-3xl bg-[#FDECEC] p-6 text-expense">โหลดข้อมูลไม่สำเร็จ: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex gap-2 rounded-full bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-full py-2.5 text-[14px] font-bold transition-all ${
              activeTab === tab.id
                ? "bg-brand text-white shadow-sm"
                : "text-ink-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-center gap-4">
        <button type="button" onClick={prevMonth} className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-muted">
          ‹
        </button>
        <span className="text-[16px] font-bold text-navy">
          {MONTHS_TH[month]} {year + 543}
        </span>
        <button type="button" onClick={nextMonth} className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-muted">
          ›
        </button>
      </div>

      {/* Summary cards */}
      <section className="rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-[18px] font-bold text-navy m-0">สรุปภาพรวมเดือนนี้</h2>
          <span className="text-ink-faint text-sm">ⓘ</span>
          <UBot size={70} pose="commerce" className="ml-auto -mr-2 -mt-4" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Income card */}
          <div className="rounded-2xl bg-[#E8F5E9] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C8E6C9] text-sm">📈</span>
              <span className="text-[13px] font-semibold text-[#2E7D32]">รายรับ</span>
            </div>
            <div className="text-[22px] font-extrabold text-[#1B5E20]">
              ฿{isLoading ? "..." : income.toLocaleString()}
            </div>
            <span className="text-[12px] text-[#43A047] font-semibold">↑ 12%</span>
          </div>

          {/* Expense card */}
          <div className="rounded-2xl bg-[#FCE4EC] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8BBD0] text-sm">🛒</span>
              <span className="text-[13px] font-semibold text-[#C62828]">รายจ่าย</span>
            </div>
            <div className="text-[22px] font-extrabold text-[#B71C1C]">
              ฿{isLoading ? "..." : expense.toLocaleString()}
            </div>
            <span className="text-[12px] text-[#E53935] font-semibold">↑ 8%</span>
          </div>
        </div>

        {/* Net profit */}
        <div className="rounded-2xl bg-[#E3F2FD] p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">📊</span>
              <span className="text-[13px] font-semibold text-brand">กำไรสุทธิ</span>
            </div>
            <div className="text-[26px] font-extrabold text-brand">
              ฿{isLoading ? "..." : Math.abs(profit).toLocaleString()}
            </div>
            <span className="text-[12px] text-brand font-semibold">↑ 15%</span>
          </div>
        </div>
      </section>

      {/* Expense by category */}
      <section className="rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-navy m-0">รายจ่ายตามหมวดหมู่</h2>
          <Link href="/transactions" className="text-[14px] font-semibold text-brand no-underline">
            ดูทั้งหมด &gt;
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {mockCategories.map((cat) => (
            <div key={cat.label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-line-subtle text-lg shrink-0">
                {cat.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[14px] font-semibold text-navy">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-navy">฿{cat.amount.toLocaleString()}</span>
                    <span className="text-[12px] text-ink-muted">{cat.pct}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-line-subtle overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
