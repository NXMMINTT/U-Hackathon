import { ChatShell } from "@/components/home/phone/ChatShell";
import { ConfirmCard } from "@/components/home/phone/ConfirmCard";
import { SavedReply } from "@/components/home/phone/SavedReply";

export function SlipScreen() {
  return (
    <ChatShell>
      <div className="w-[130px] self-end rounded-[14px] bg-white p-1.5">
        <div className="flex h-[150px] flex-col items-center justify-center gap-0.5 rounded-[10px] bg-brand-tint">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#CDEBD9] font-bold text-income">✓</span>
          <span className="text-[10px] text-ink-muted">โอนเงินสำเร็จ</span>
          <b className="text-base">฿1,780.00</b>
          <span className="text-[10px] text-ink-muted">16 ต.ค. 69 · 14:02</span>
        </div>
      </div>
      <ConfirmCard
        title="อ่านสลิปแล้ว ถูกไหมคะ?"
        rows={[["ประเภท", <span key="t" className="text-income">รายรับ</span>], ["ยอด", "฿1,780"], ["สินค้า", "น้ำพริก ×20"]]}
      />
      <SavedReply>ตัดสต็อกน้ำพริก เหลือ 120</SavedReply>
    </ChatShell>
  );
}
