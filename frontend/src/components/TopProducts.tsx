import type { Overview } from "@/hooks/useDashboard";
import { formatQty, formatTHB } from "@/lib/format";
import { productEmoji, productPhoto } from "@/lib/market";
import th from "@/locales/th.json";

import { StockBadge } from "./StockBadge";
import { Card } from "./ui/Card";

function ProductThumb({ name }: { name: string }) {
  const photo = productPhoto(name);
  return (
    <span className="relative grid h-11 w-11 flex-none place-items-center overflow-hidden rounded-[10px] bg-[#E3EEFB] text-2xl">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- static product photo
        <img src={photo} alt="" className="h-full w-full object-cover" />
      ) : (
        productEmoji(name)
      )}
    </span>
  );
}

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
              <span className="relative flex-none">
                <ProductThumb name={p.name} />
                <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">
                  {index + 1}
                </span>
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
