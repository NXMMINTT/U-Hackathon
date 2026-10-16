export function PriceRadarScreen() {
  const dots = [
    [41, 0], [43, 1], [50, 0], [56, 0], [79, 0], [84, 1],
  ];
  return (
    <div className="flex h-full flex-col gap-2.5 bg-white px-3.5 py-[18px]">
      <b className="text-sm">น้ำพริกตาแดงโบราณ</b>
      <div className="rounded-[14px] bg-sky-deep p-2.5">
        <b className="text-brand">U-Bot แนะนำ</b>
        <div>
          ตั้งราคา <b>฿85</b> แล้วเปิดขายบน Lazada ร้านคู่แข่งที่นั่นของหมด
        </div>
      </div>
      <div className="relative mt-1 h-[110px]">
        <div className="absolute bottom-[22px] left-[55%] top-[18px] w-[15%] rounded-lg bg-[#E3F0FF]" />
        <div className="absolute bottom-[22px] left-0 right-0 h-[3px] rounded bg-brand-soft" />
        <div className="absolute bottom-[22px] left-[7%] top-0 w-0.5 bg-[#F2A48E]" />
        <span className="absolute left-[7%] top-0 ml-1 text-[10px] font-bold text-[#9A3412]">ทุน 45</span>
        {dots.map(([x, lane]) => (
          <span key={x} className="absolute h-3 w-3 rounded-full bg-brand-light" style={{ left: `${x}%`, bottom: 28 + lane * 14 }} />
        ))}
        <span className="absolute bottom-[28px] left-[64%] h-3 w-3 rounded-full bg-brand" />
        <span className="absolute bottom-[28px] left-[70%] h-3.5 w-3.5 rounded-full bg-navy" />
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-ink-muted">
          <span>฿40</span>
          <span>฿80</span>
          <span>฿110</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {[["TikTok Shop", "฿69"], ["Shopee", "฿75"], ["Lazada · ของหมด", "฿82"]].map(([k, v]) => (
          <div key={k} className="flex justify-between rounded-lg bg-brand-tint px-2 py-1.5">
            <span>{k}</span>
            <b>{v}</b>
          </div>
        ))}
        <div className="flex justify-between rounded-lg bg-brand-soft px-2 py-1.5">
          <span>ร้านคุณ</span>
          <b>฿89</b>
        </div>
      </div>
    </div>
  );
}
