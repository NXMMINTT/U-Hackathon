import { InfoRow } from "@/components/home/phone/InfoRow";

/** Tax step 3: the yearly summary on the web dashboard. */
export function ProfitSummaryCard() {
  return (
    <div aria-hidden="true" className="flex w-[340px] max-w-full flex-col gap-4 rounded-[30px] bg-white p-7 text-[15px] shadow-[0_24px_50px_rgba(21,48,90,.14)]">
      <div className="flex items-center justify-between">
        <b className="text-lg">สรุปปี 2569</b>
        <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">หน้าเว็บ</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <InfoRow k="รายรับ" v={<span className="text-income">฿1,262,000</span>} />
        <InfoRow k="รายจ่าย" v={<span className="text-expense">฿748,500</span>} />
        <div className="mt-1 flex items-baseline justify-between border-t border-line pt-2">
          <span className="font-bold">กำไรสุทธิ</span>
          <b className="text-2xl text-brand">฿513,500</b>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <b>สินค้าขายดี</b>
        {[["น้ำพริกตาแดง", 62], ["สบู่มะกรูด", 24], ["กระเป๋าผ้าทอ", 14]].map(([name, pct]) => (
          <div key={name} className="flex flex-col gap-1">
            <InfoRow k={name as string} v={`${pct}%`} />
            <div className="h-1.5 overflow-hidden rounded-full bg-brand-soft">
              <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
