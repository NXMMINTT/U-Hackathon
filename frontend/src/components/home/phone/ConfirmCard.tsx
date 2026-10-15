import { InfoRow } from "@/components/home/phone/InfoRow";

/** Confirmation card U-Bot sends back after reading an entry. */
export function ConfirmCard({ title, rows }: { title: string; rows: [string, React.ReactNode][] }) {
  return (
    <div className="w-[200px] self-start overflow-hidden rounded-[14px] bg-white">
      <div className="px-2.5 pb-1 pt-2">
        <div className="font-bold">{title}</div>
        {rows.map(([k, v]) => (
          <InfoRow key={k} k={k} v={v} />
        ))}
      </div>
      <div className="flex gap-1.5 px-2.5 pb-2.5 pt-1.5">
        <span className="flex-1 rounded-lg bg-brand py-1 text-center font-semibold text-white">ถูกต้อง</span>
        <span className="flex-1 rounded-lg bg-brand-soft py-1 text-center font-semibold text-brand">แก้ไข</span>
      </div>
    </div>
  );
}
