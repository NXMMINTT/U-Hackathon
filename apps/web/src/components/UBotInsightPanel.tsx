import th from "@/locales/th.json";
import { Card } from "./ui/Card";

const SAMPLE_INSIGHTS = [
  "รายรับเดือนนี้สูงกว่าเดือนที่แล้ว 12%",
  "ค่าใช้จ่ายหมวดวัตถุดิบเพิ่มขึ้นผิดปกติในสัปดาห์นี้",
  "รายได้สะสมปีนี้ใกล้เกณฑ์จดทะเบียน VAT แล้ว",
];

/** Static placeholder — wired to POST /api/v1/insights/ask once that endpoint exists (Phase 5). */
export function UBotInsightPanel() {
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-semibold text-gray-900">{th.ubot.title}</h2>
      <ul className="flex flex-col gap-2">
        {SAMPLE_INSIGHTS.map((insight) => (
          <li key={insight} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {insight}
          </li>
        ))}
      </ul>
      <input
        disabled
        placeholder={th.ubot.placeholder}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400"
      />
    </Card>
  );
}
