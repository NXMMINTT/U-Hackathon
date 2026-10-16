/** Where the shop's price sits among competitors' prices (cheapest → priciest), with U-Bot's suggestion marked. */
export function PricePositionBar({
  competitorPrices,
  myPrice,
  suggestedPrice,
}: {
  competitorPrices: number[];
  myPrice: number;
  suggestedPrice?: number;
}) {
  if (competitorPrices.length === 0) return null;
  const all = [...competitorPrices, myPrice, ...(suggestedPrice ? [suggestedPrice] : [])];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const at = (price: number) => `${((price - min) / span) * 100}%`;
  const cheaperThanMe = competitorPrices.filter((p) => p < myPrice).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative mx-3 h-16" aria-hidden="true">
        <div className="absolute inset-x-0 top-7 h-2 rounded-full bg-gradient-to-r from-[#D1FAE5] via-[#E0ECFF] to-[#FDE2E2]" />
        {competitorPrices.map((p, i) => (
          <span
            key={i}
            className="absolute top-[26px] h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-ink-faint"
            style={{ left: at(p) }}
          />
        ))}
        {suggestedPrice !== undefined && (
          <span className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: at(suggestedPrice) }}>
            <span className="whitespace-nowrap rounded-full bg-sun px-2 text-[11px] font-bold text-[#4A3500]">แนะนำ ฿{suggestedPrice}</span>
            <span className="h-3.5 w-0.5 bg-sun" />
          </span>
        )}
        <span className="absolute top-[34px] flex -translate-x-1/2 flex-col items-center" style={{ left: at(myPrice) }}>
          <span className="h-3 w-0.5 bg-brand" />
          <span className="whitespace-nowrap rounded-full bg-brand px-2 text-[11px] font-bold text-white">คุณ ฿{myPrice}</span>
        </span>
      </div>
      <div className="flex justify-between text-[12px] text-ink-muted">
        <span>ถูกสุด ฿{min.toLocaleString("en-US")}</span>
        <span>แพงสุด ฿{max.toLocaleString("en-US")}</span>
      </div>
      <p className="m-0 text-[14px] text-ink-body">
        มีคู่แข่ง <b>{cheaperThanMe}</b> จาก {competitorPrices.length} ร้านที่ขายถูกกว่าราคาของคุณ
      </p>
    </div>
  );
}
