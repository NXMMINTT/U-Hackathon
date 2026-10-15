"use client";

import { RevenueTrendChart, type RevenueTrendPoint } from "@/components/charts/RevenueTrendChart";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { UBotInsightPanel } from "@/components/UBotInsightPanel";
import { useApiHealth } from "@/hooks/useApiHealth";
import { formatTHB } from "@/lib/format";
import th from "@/locales/th.json";

const SAMPLE_TREND: RevenueTrendPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: `2026-09-${String(i + 1).padStart(2, "0")}`,
  revenue: 4000 + Math.round(Math.sin(i / 4) * 800 + i * 60),
}));

export default function HealthPage() {
  const { isLoading, isError } = useApiHealth();

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{th.health.title}</h1>
        <Badge tone={isLoading ? "neutral" : isError ? "danger" : "success"}>
          {isLoading ? "..." : isError ? th.backend.disconnected : th.backend.connected}
        </Badge>
      </header>

      <Card className="bg-amber-50 text-xs text-amber-800">{th.health.sampleDataNotice}</Card>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label={th.health.income} value={formatTHB(154320)} tone="income" />
        <StatCard label={th.health.expense} value={formatTHB(98210)} tone="expense" />
        <StatCard label={th.health.netProfit} value={formatTHB(56110)} />
        <StatCard label={th.health.healthScore} value="78 / 100" />
      </div>

      <Card>
        <RevenueTrendChart data={SAMPLE_TREND} />
      </Card>

      <UBotInsightPanel />
    </div>
  );
}
