import type { TaxMeter as TaxMeterData } from "@/hooks/useDashboard";
import { formatTHB } from "@/lib/format";
import th from "@/locales/th.json";

import { Card } from "./ui/Card";

const COLOR_CLASSES = {
  green: { bar: "bg-brand-light", note: "bg-brand-tint text-ink-body" },
  yellow: { bar: "bg-[#E0A030]", note: "bg-[#FFF6E5] text-[#6B4E16]" },
  red: { bar: "bg-expense", note: "bg-[#FEF2F2] text-[#991B1B]" },
} as const;

/** Year-to-date sales vs. the VAT threshold; color comes from the backend
 * (warning levels live in backend/config/tax_rules.yaml). */
export function TaxMeter({ data }: { data: TaxMeterData }) {
  const percent = Number(data.ratio) * 100;
  const colors = COLOR_CLASSES[data.color];

  return (
    <Card className="flex flex-col gap-2.5">
      <h2 className="text-lg font-semibold">{th.taxMeter.title}</h2>
      <div className="flex justify-between gap-2 text-sm">
        <span className="text-ink-muted">{th.taxMeter.subtitle.replace("{year}", String(data.year + 543))}</span>
        <b>{formatTHB(data.annual_income)}</b>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-line-subtle">
        <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <p className="text-xs text-ink-muted">
        {th.taxMeter.ofThreshold
          .replace("{percent}", percent.toFixed(0))
          .replace("{threshold}", formatTHB(data.threshold))}
      </p>
      <p className={`rounded-[10px] px-3.5 py-2.5 text-[13px] ${colors.note}`}>{th.taxMeter[data.color]}</p>
    </Card>
  );
}
