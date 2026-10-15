import { Card } from "@/components/ui/Card";
import th from "@/locales/th.json";

/** Placeholder — wired to GET /api/v1/macro/indicators once that endpoint
 * exists (Phase 5, MACRO_DATA_MODE=mock|live on the backend). */
export default function TrendsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900">{th.trends.title}</h1>
      <Card className="bg-amber-50 text-xs text-amber-800">
        ข้อมูลตัวอย่าง — ยังไม่เชื่อมต่อ API จริง (รอ Phase 5)
      </Card>
    </div>
  );
}
