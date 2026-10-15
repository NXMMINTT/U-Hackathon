import type { Metadata } from "next";

import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "U-Ledger AI — จดบัญชีร้านแค่แชท LINE",
  description: "จดบัญชีร้านผ่าน LINE กับ U-Bot รู้ทันภาษี VAT และรู้ราคาคู่แข่งทุกแพลตฟอร์ม",
};

/** Root layout for the public home page. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${fontVariables} scroll-smooth`}>
      <body className="font-sans text-[17px] leading-relaxed">{children}</body>
    </html>
  );
}
