import { ChatHeader } from "@/components/home/phone/ChatHeader";

export function HeroChatScreen() {
  return (
    <>
      <ChatHeader />
      <div className="flex flex-1 flex-col gap-2 p-2.5">
        <span className="self-end rounded-[14px] rounded-br-sm bg-chat px-3 py-1.5 text-[#0F2A12]">ขายน้ำพริก 20 กระปุก 1780</span>
        <div className="w-[190px] self-start overflow-hidden rounded-[14px] bg-white">
          <div className="px-2.5 pb-1 pt-2">
            <div className="font-bold">จดให้แล้วค่ะ ✓</div>
            <div className="font-bold text-income">รายรับ ฿1,780</div>
            <div className="text-ink-body">ขายน้ำพริกตาแดง · ตัดสต็อกแล้ว เหลือ 120</div>
          </div>
          <div className="flex gap-1.5 px-2.5 pb-2.5 pt-1">
            <span className="flex-1 rounded-lg bg-brand-soft py-1 text-center font-semibold text-brand">แก้ไข</span>
            <span className="flex-1 rounded-lg bg-[#FDECEC] py-1 text-center font-semibold text-expense">ลบ</span>
          </div>
        </div>
        <span className="self-end rounded-[14px] rounded-br-sm bg-chat px-3 py-1.5 text-[#0F2A12]">ปีนี้ใกล้ต้องจด VAT ยัง</span>
        <span className="max-w-[200px] self-start rounded-[14px] rounded-bl-sm bg-sun-soft px-2.5 py-1.5 text-[#5C3E00]">69% แล้วค่ะ ถ้าขายแบบนี้ต่อ จะถึงเพดานราว ก.พ. ปีหน้านะคะ</span>
      </div>
      {/* LINE rich menu */}
      <div className="grid grid-cols-3 grid-rows-[64px_64px] gap-1 bg-brand p-1 font-bold">
        <div className="row-span-2 flex flex-col justify-between rounded-[10px] bg-white p-2">
          <b className="text-[22px] leading-none text-brand">จด</b>
          <span className="text-[11px]">รายรับ/<br />รายจ่าย</span>
        </div>
        <div className="grid place-items-center rounded-[10px] bg-brand-soft">สรุป</div>
        <div className="grid place-items-center rounded-[10px] bg-sun-soft text-[#5C3E00]">ภาษี</div>
        <div className="grid place-items-center rounded-[10px] bg-brand-soft text-center leading-tight">ราคา<br />คู่แข่ง</div>
        <div className="grid place-items-center rounded-[10px] bg-brand-soft">ถาม U-Bot</div>
      </div>
    </>
  );
}
