import { Card } from "@/components/ui/Card";
import { formatTHB } from "@/lib/format";
import th from "@/locales/th.json";

const SAMPLE_ANNUAL_REVENUE = 1_440_000;
const VAT_THRESHOLD = 1_800_000;
const ratioPercent = Math.round((SAMPLE_ANNUAL_REVENUE / VAT_THRESHOLD) * 100);

/** Placeholder — wired to GET /api/v1/tax/vat-status once that endpoint exists
 * (Phase 3). The VAT math itself already lives in app/tax_engine/vat.py. */
export default function TaxPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900">{th.tax.title}</h1>
      <Card className="bg-amber-50 text-xs text-amber-800">
        ข้อมูลตัวอย่าง — ยังไม่เชื่อมต่อ API จริง (รอ Phase 3)
      </Card>
      <Card className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">{th.tax.vatProgress}</span>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-amber-500"
            style={{ width: `${ratioPercent}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {formatTHB(SAMPLE_ANNUAL_REVENUE)} / {formatTHB(VAT_THRESHOLD)} ({ratioPercent}%)
        </span>
      </Card>
    </div>
  );
}
