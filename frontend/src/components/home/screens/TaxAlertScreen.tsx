import { ChatShell } from "@/components/home/phone/ChatShell";
import { InfoRow } from "@/components/home/phone/InfoRow";
import { UserBubble } from "@/components/home/phone/UserBubble";

/** Tax step 2: U-Bot pushes a heads-up when sales cross into the next zone. */
export function TaxAlertScreen() {
  return (
    <ChatShell>
      <div className="w-[220px] self-start overflow-hidden rounded-[14px] bg-white">
        <div className="bg-sun-soft px-2.5 py-1.5 font-bold text-sun-ink">แจ้งเตือนภาษี · โซนเหลือง</div>
        <div className="flex flex-col gap-1 px-2.5 py-2">
          <InfoRow k="ยอดขายสะสมปีนี้" v="฿1,262,000" />
          <div className="h-1.5 overflow-hidden rounded-full bg-brand-soft">
            <div className="h-full w-[70%] rounded-full bg-sun" />
          </div>
          <div className="text-ink-muted">70% ของเพดาน VAT ฿1.8 ล้าน</div>
        </div>
      </div>
      <span className="max-w-[220px] self-start rounded-[14px] rounded-bl-sm bg-white px-2.5 py-1.5">
        <b>สิ่งที่ควรเตรียมไว้ค่ะ</b>
        <span className="block">✓ เก็บใบเสร็จค่าวัตถุดิบให้ครบ</span>
        <span className="block">✓ เช็กยอดขายทุกแพลตฟอร์มให้ตรง</span>
        <span className="block">✓ ถ้าเกินเพดาน จด VAT ภายใน 30 วัน</span>
      </span>
      <UserBubble>โอเค ขอบคุณนะ</UserBubble>
    </ChatShell>
  );
}
