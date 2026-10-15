import type { Overview } from "@/hooks/useDashboard";
import { formatQty, formatTHB } from "@/lib/format";
import th from "@/locales/th.json";

import { StockBadge } from "./StockBadge";
import { Card } from "./ui/Card";

export function TopProducts({ products }: { products: Overview["top_products"] }) {
  return (
    <Card className="flex flex-col gap-2.5">
      <h2 className="text-lg font-semibold">{th.topProducts.title}</h2>
      {products.length === 0 ? (
        <p className="text-sm text-ink-muted">{th.topProducts.empty}</p>
      ) : (
        <ol className="flex flex-col">
          {products.map((p, index) => (
            <li key={p.product_id} className="flex items-center gap-3 border-t border-line-subtle py-3 first:border-t-0">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-[10px] bg-[#E3EEFB] text-lg font-bold text-brand">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="truncate">{p.name}</span> <StockBadge stockQty={p.stock_qty} />
                </span>
                <span className="text-xs text-ink-muted">
                  {th.topProducts.sold} {formatQty(p.quantity_sold)} {p.unit} · {th.topProducts.stock}{" "}
                  {formatQty(p.stock_qty)} {p.unit}
                </span>
              </div>
              <span className="text-sm font-semibold">{formatTHB(p.revenue)}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
