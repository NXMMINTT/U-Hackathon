"use client";

import { UBot } from "@/components/brand/UBot";
import { LineIcon } from "@/components/ui/LineIcon";
import { useOverview } from "@/hooks/dashboard/useOverview";
import { formatBaht } from "@/lib/format";

/** Change vs the previous month, or nothing when there is no previous figure to compare with. */
function Change({ now, before, goodWhenUp = true }: { now: number; before: number | undefined; goodWhenUp?: boolean }) {
  if (before === undefined || before === 0) return null;
  const pct = Math.round(((now - before) / Math.abs(before)) * 100);
  const up = pct >= 0;
  const good = up === goodWhenUp;
  return (
    <span className={`text-[12px] font-semibold ${good ? "text-income" : "text-expense"}`}>
      {up ? "↑" : "↓"} {Math.abs(pct)}% จากเดือนก่อน
    </span>
  );
}

/** Income, expense and net profit of a "YYYY-MM" month, compared with the month before. */
export function MonthSummaryCards({ month, previousMonth }: { month: string; previousMonth: string }) {
  const current = useOverview(month);
  const previous = useOverview(previousMonth);
  const value = (key: "income" | "expense" | "net_profit") => (current.data ? Number(current.data[key]) : 0);
  const before = (key: "income" | "expense" | "net_profit") => (previous.data ? Number(previous.data[key]) : undefined);
  const show = (key: "income" | "expense" | "net_profit") => (current.isLoading ? "…" : formatBaht(Math.abs(value(key))));

  if (current.error) {
    return <p className="rounded-3xl bg-[#FDECEC] p-6 text-expense">โหลดข้อมูลไม่สำเร็จ: {current.error.message}</p>;
  }

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="mb-5 flex items-center gap-2">
        <h2 className="m-0 text-[18px] font-bold text-navy">สรุปภาพรวมเดือนนี้</h2>
        <UBot size={70} pose="commerce" className="-mr-2 -mt-4 ml-auto" />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#E8F5E9] p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C8E6C9] text-[#1B5E20]">
              <LineIcon name="trendUp" size={16} />
            </span>
            <span className="text-[13px] font-semibold text-[#2E7D32]">รายรับ</span>
          </div>
          <div className="text-[22px] font-extrabold text-[#1B5E20]">{show("income")}</div>
          <Change now={value("income")} before={before("income")} />
        </div>

        <div className="rounded-2xl bg-[#FCE4EC] p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F8BBD0] text-[#B71C1C]">
              <LineIcon name="trendDown" size={16} />
            </span>
            <span className="text-[13px] font-semibold text-[#C62828]">รายจ่าย</span>
          </div>
          <div className="text-[22px] font-extrabold text-[#B71C1C]">{show("expense")}</div>
          <Change now={value("expense")} before={before("expense")} goodWhenUp={false} />
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-[#E3F2FD] p-4">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#BBDEFB] text-brand">
              <LineIcon name="barChart" size={16} />
            </span>
            <span className="text-[13px] font-semibold text-brand">{value("net_profit") < 0 ? "ขาดทุนสุทธิ" : "กำไรสุทธิ"}</span>
          </div>
          <div className={`text-[26px] font-extrabold ${value("net_profit") < 0 ? "text-expense" : "text-brand"}`}>{show("net_profit")}</div>
          <Change now={value("net_profit")} before={before("net_profit")} />
        </div>
      </div>
    </section>
  );
}
