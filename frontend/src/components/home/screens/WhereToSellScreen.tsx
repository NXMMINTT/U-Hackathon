/** Radar step 2: where the same product sells. */
export function WhereToSellScreen() {
  const platforms: [string, number, string?][] = [
    ["Shopee", 1240],
    ["TikTok Shop", 980],
    ["Lazada", 610, "คู่แข่งของหมด"],
    ["Amazon", 120],
  ];
  return (
    <div className="flex h-full flex-col gap-2.5 bg-white px-3.5 py-[18px]">
      <b className="text-sm">ควรไปขายที่ไหน</b>
      <span className="text-ink-muted">ยอดขายน้ำพริกแบบเดียวกัน / เดือน</span>
      <div className="flex flex-col gap-2.5">
        {platforms.map(([name, sold, note]) => (
          <div key={name} className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span>
                {name}
                {note && <span className="ml-1.5 rounded-full bg-sun-soft px-1.5 text-[10px] font-bold text-sun-ink">{note}</span>}
              </span>
              <b>{sold.toLocaleString("en-US")}</b>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-brand-soft">
              <div className={`h-full rounded-full ${note ? "bg-sun" : "bg-brand"}`} style={{ width: `${(sold / 1240) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-[14px] bg-sky-deep p-2.5">
        <b className="text-brand">U-Fox แนะนำ</b>
        <div>เปิดร้านบน Lazada ตอนนี้ คู่แข่งของหมด ได้ลูกค้าก่อนใคร</div>
      </div>
    </div>
  );
}
