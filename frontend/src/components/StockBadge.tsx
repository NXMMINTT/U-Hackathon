import th from "@/locales/th.json";

import { Badge } from "./ui/Badge";

export const LOW_STOCK_QTY = 10;

export function StockBadge({ stockQty }: { stockQty: string }) {
  const qty = Number(stockQty);
  if (qty <= 0) return <Badge tone="danger">{th.stock.outOfStock}</Badge>;
  if (qty <= LOW_STOCK_QTY) return <Badge tone="warning">{th.stock.low}</Badge>;
  return null;
}
