"use client";

import { StockBadge } from "@/components/StockBadge";
import { Card } from "@/components/ui/Card";
import { useProducts } from "@/hooks/dashboard/useProducts";
import { formatQty, formatTHB } from "@/lib/format";
import th from "@/locales/th.json";

export default function StockPage() {
  const { data, isLoading, error } = useProducts();

  return (
    <div className="flex flex-col gap-[22px]">
      <h1 className="text-2xl font-bold md:text-[30px]">{th.stock.title}</h1>
      {error && <Card className="border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">{error.message}</Card>}
      {isLoading && <Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>}
      {data?.length === 0 && <Card className="text-center text-sm text-ink-muted">{th.stock.empty}</Card>}

      {data && data.length > 0 && (
        <Card className="flex flex-col divide-y divide-line-subtle !p-0">
          {data.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3.5 md:px-6">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {p.name} <StockBadge stockQty={p.stock_qty} />
                </span>
                <span className="text-xs text-ink-muted">
                  {th.stock.unitCost} {p.unit_cost ? formatTHB(p.unit_cost) : "-"}
                </span>
              </div>
              <span className="text-sm font-semibold">
                {formatQty(p.stock_qty)} {p.unit}
              </span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
