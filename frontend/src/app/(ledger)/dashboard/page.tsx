"use client";

import Link from "next/link";

import { UBot } from "@/components/brand/UBot";

const MENU_ITEMS = [
  { href: "/transactions?mode=income", icon: "income", label: "บันทึกรายรับ", sub: "เพิ่มรายรับ\nง่ายๆเลย", color: "bg-[#FFF4E0]", iconColor: "text-[#F59E0B]" },
  { href: "/transactions?mode=expense", icon: "expense", label: "บันทึกรายจ่าย", sub: "จดรายจ่าย\nได้ทันที", color: "bg-[#E8F5E9]", iconColor: "text-[#12804F]" },
  { href: "/dashboard/summary", icon: "summary", label: "สรุปภาพรวม", sub: "ดูรายรับ-รายจ่าย\nรายเดือน", color: "bg-[#E3F2FD]", iconColor: "text-[#2563EB]" },
  { href: "/stock", icon: "stock", label: "จัดการสินค้า", sub: "เช็ครายการสินค้า\nและสต็อก", color: "bg-[#FFF3E0]", iconColor: "text-[#E65100]" },
  { href: "/market", icon: "market", label: "ดูตลาดคู่แข่ง", sub: "ส่งสินค้า / เทรนด์\nต่างประเทศ", color: "bg-[#E8EAF6]", iconColor: "text-[#3F51B5]", badge: "ใหม่" },
  { href: "/market/plans", icon: "premium", label: "อัปเกรดแพ็คเกจ", sub: "ฟีเจอร์เพิ่มเติม\nเพื่อธุรกิจของคุณ", color: "bg-[#FFF8E1]", iconColor: "text-[#F59E0B]" },
];

const BOTTOM_LINKS = [
  { href: "/settings", icon: "settings", label: "ตั้งค่าร้าน" },
  { href: "/help", icon: "help", label: "วิธีใช้งาน" },
  { href: "/chat", icon: "chat", label: "คุยกับ U-Fox" },
];

function MenuIcon({ type, className = "" }: { type: string; className?: string }) {
  const c = `w-8 h-8 ${className}`;
  switch (type) {
    case "income":
      return (
        <svg className={c} viewBox="0 0 32 32" fill="none">
          <rect x="6" y="8" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M12 16h8M16 12v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "expense":
      return (
        <svg className={c} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M16 11v10M13 14l3-3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "summary":
      return (
        <svg className={c} viewBox="0 0 32 32" fill="none">
          <rect x="8" y="14" width="4" height="10" rx="1" fill="currentColor" />
          <rect x="14" y="10" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="20" y="6" width="4" height="18" rx="1" fill="currentColor" />
        </svg>
      );
    case "stock":
      return (
        <svg className={c} viewBox="0 0 32 32" fill="none">
          <rect x="7" y="6" width="18" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M12 12h8M12 16h8M12 20h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "market":
      return (
        <svg className={c} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M16 6a10 10 0 000 20M6 16h20M16 6c-3 3-3 17 0 20M16 6c3 3 3 17 0 20" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "premium":
      return (
        <svg className={c} viewBox="0 0 32 32" fill="none">
          <path d="M16 6l3 6 7 1-5 5 1.2 7L16 22l-6.2 3L11 18l-5-5 7-1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case "settings":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      );
    case "help":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round" />
        </svg>
      );
    case "chat":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          <path d="M8 10h.01M12 10h.01M16 10h.01" />
        </svg>
      );
    default:
      return null;
  }
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5 pb-4">
      {/* Hero greeting */}
      <section className="relative rounded-[28px] bg-gradient-to-br from-[#E0F2FE] to-[#F0F7FF] px-6 py-7 overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[22px] font-bold text-navy leading-tight mb-1">
              สวัสดีครับ! 👋
            </p>
            <p className="text-[28px] font-extrabold text-brand leading-tight">
              ผม U-Fox
            </p>
            <p className="text-[17px] text-ink-body mt-1 leading-snug">
              ผู้ช่วยจัดการการเงิน<br />ของคุณครับ
            </p>
          </div>
          <UBot size={120} pose="ledger" className="shrink-0 -mr-2 -mt-2" />
        </div>
        <div className="mt-4 rounded-2xl bg-white/80 backdrop-blur-sm px-5 py-3.5 shadow-sm">
          <p className="text-[15px] text-ink-body m-0">
            วันนี้อยากให้ผมช่วยเรื่องอะไรดีครับ?
          </p>
        </div>
      </section>

      {/* Menu grid */}
      <section className="grid grid-cols-3 gap-3">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-2 rounded-[20px] bg-white p-4 pt-5 text-center no-underline shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-[0.97] transition-transform"
          >
            {item.badge && (
              <span className="absolute -top-1.5 -right-1.5 rounded-full bg-expense px-2 py-0.5 text-[10px] font-bold text-white">
                {item.badge}
              </span>
            )}
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} ${item.iconColor}`}>
              <MenuIcon type={item.icon} />
            </span>
            <span className="text-[13px] font-bold text-navy leading-tight">{item.label}</span>
            <span className="text-[11px] text-ink-muted leading-tight whitespace-pre-line">{item.sub}</span>
          </Link>
        ))}
      </section>

      {/* Bottom links */}
      <section className="flex justify-center gap-6 py-2">
        {BOTTOM_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1.5 text-ink-muted no-underline"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-line-subtle">
              <MenuIcon type={item.icon} />
            </span>
            <span className="text-[12px] font-medium">{item.label}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
