import Link from "next/link";

import { LineAddFriendButton } from "@/components/brand/LineAddFriendButton";
import { UBot } from "@/components/brand/UBot";

const STEPS: { title: string; body: string; example?: string }[] = [
  { title: "เพิ่มเพื่อน U-Bot ใน LINE", body: "กดปุ่มด้านล่าง แล้วเริ่มแชทได้เลย ไม่ต้องโหลดแอปเพิ่ม" },
  { title: "พิมพ์รายการเหมือนคุยกับเพื่อน", body: "U-Bot แยกรายรับ รายจ่าย สินค้า และจำนวนให้เอง", example: "ขายน้ำพริก 20 กระปุก 1780" },
  { title: "หรือส่งรูปสลิป / อัดเสียง", body: "U-Bot อ่านยอดเงินจากรูปหรือเสียง แล้วส่งการ์ดมาให้ตรวจ", example: "ซื้อพริกแห้ง 2 กระสอบ 900" },
  { title: "กดยืนยันในการ์ด", body: "รายการที่ยืนยันแล้วจะนับเข้ายอดและตัดสต็อก ถ้าผิดกด \"แก้ไข\" ได้ก่อนยืนยัน" },
  { title: "ดูสรุปที่หน้าเว็บ", body: "ร้านของฉันแสดงกำไร มิเตอร์ภาษี VAT สินค้าขายดี และรายการที่รอยืนยัน" },
];

const COMMANDS = [
  { say: "สรุป", does: "ยอดขาย รายจ่าย และกำไรของวันนี้" },
  { say: "ปีนี้ใกล้ต้องจด VAT ยัง", does: "ยอดขายทั้งปีเทียบเพดาน 1.8 ล้านบาท" },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-5">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#E0F2FE] to-[#F0F7FF] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="m-0 text-[22px] font-bold text-navy">วิธีใช้งาน U-Ledger AI</h1>
            <p className="m-0 mt-1 text-[14px] text-ink-muted">จดบัญชีผ่าน LINE ใน 5 ขั้นตอน</p>
          </div>
          <UBot size={80} pose="idea" className="shrink-0" />
        </div>
      </section>

      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-4 rounded-[22px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand font-bold text-white">{i + 1}</span>
            <div className="flex flex-col gap-1">
              <b className="text-navy">{s.title}</b>
              <span className="text-[15px] text-ink-body">{s.body}</span>
              {s.example && (
                <span className="self-start rounded-[14px] rounded-br-sm bg-chat px-3 py-1.5 text-[14px] text-[#0F2A12]">{s.example}</span>
              )}
            </div>
          </li>
        ))}
      </ol>

      <section className="flex flex-col gap-3 rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h2 className="m-0 text-[18px] font-bold text-navy">คำที่พิมพ์ถาม U-Bot ได้</h2>
        {COMMANDS.map((c) => (
          <div key={c.say} className="flex flex-wrap items-center gap-3">
            <span className="rounded-[14px] bg-chat px-3 py-1.5 text-[14px] font-semibold text-[#0F2A12]">{c.say}</span>
            <span className="text-[15px] text-ink-body">→ {c.does}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col items-start gap-3 rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h2 className="m-0 text-[18px] font-bold text-navy">จดจากหน้าเว็บก็ได้</h2>
        <p className="m-0 text-[15px] text-ink-body">ไม่สะดวกแชท? บันทึกรายรับรายจ่ายตรงนี้ได้เลย รายการจะนับเข้ายอดทันที</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/transactions?mode=income" className="inline-flex min-h-[44px] items-center rounded-full bg-income px-5 font-bold text-white no-underline">
            บันทึกรายรับ
          </Link>
          <Link href="/transactions?mode=expense" className="inline-flex min-h-[44px] items-center rounded-full bg-[#FF4081] px-5 font-bold text-white no-underline">
            บันทึกรายจ่าย
          </Link>
        </div>
        <LineAddFriendButton label="เพิ่มเพื่อน U-Bot ใน LINE" />
      </section>
    </div>
  );
}
