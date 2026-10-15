import { Card } from "./Card";

export function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "income" | "expense" | "neutral";
}) {
  const valueColor =
    tone === "income" ? "text-income" : tone === "expense" ? "text-expense" : "text-gray-900";

  return (
    <Card className="flex flex-col gap-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
    </Card>
  );
}
