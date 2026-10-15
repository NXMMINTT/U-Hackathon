"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useTransactions } from "@/hooks/useDashboard";
import { formatQty, formatTHB, formatThaiDate } from "@/lib/format";
import th from "@/locales/th.json";

const STATUS_TONE = { pending: "warning", confirmed: "success", cancelled: "neutral" } as const;

export default function TransactionsPage() {
  const { data, isLoading, error } = useTransactions();

  return (
    <div className="flex flex-col gap-[22px]">
      <h1 className="text-2xl font-bold md:text-[30px]">{th.transactions.title}</h1>
      {error && <Card className="border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">{error.message}</Card>}
      {isLoading && <Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>}
      {data?.length === 0 && <Card className="text-center text-sm text-ink-muted">{th.transactions.empty}</Card>}

      {data && data.length > 0 && (
        <Card className="flex flex-col divide-y divide-line-subtle !p-0">
          {data.map((t) => {
            const isIncome = t.type === "income";
            return (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 md:px-6">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-semibold">{t.description ?? "-"}</span>
                  <span className="text-xs text-ink-muted">
                    {formatThaiDate(t.txn_date)} · {t.category ?? "-"} · {th.transactions.source[t.source]}
                    {t.product_name && t.quantity && ` · ${t.product_name} ×${formatQty(t.quantity)}`}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-sm font-semibold ${isIncome ? "text-income" : "text-expense"}`}>
                    {isIncome ? "+" : "-"}
                    {formatTHB(t.amount)}
                  </span>
                  {t.status !== "confirmed" && (
                    <Badge tone={STATUS_TONE[t.status]}>{th.transactions.status[t.status]}</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
