import { Card } from "@/components/ui/Card";
import th from "@/locales/th.json";

/** Placeholder — wired to GET /api/v1/transactions once the dashboard API
 * endpoints exist (Phase 3). Records are already created via the LINE bot. */
export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900">{th.transactions.title}</h1>
      <Card className="text-center text-sm text-gray-500">{th.transactions.empty}</Card>
    </div>
  );
}
