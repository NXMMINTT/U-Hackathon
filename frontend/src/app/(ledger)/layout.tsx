import type { Metadata } from "next";

import { LiffAuthGate } from "@/components/LiffAuthGate";
import { NavTabs, SiteHeader } from "@/components/NavTabs";
import { QueryProvider } from "@/components/QueryProvider";

import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "U-Ledger AI",
  description: "ผู้ช่วยบัญชีและนักวิเคราะห์ตลาดใน LINE สำหรับร้านค้าออนไลน์",
};

/** Root layout for the signed-in app: ร้านของฉัน, Market Radar, transactions, stock. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={fontVariables}>
      <body className="min-h-screen bg-brand-tint font-sans text-[17px] leading-relaxed">
        <QueryProvider>
          <LiffAuthGate>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="mx-auto w-full max-w-[1160px] flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-16 md:pt-8">
                {children}
              </main>
              <NavTabs />
            </div>
          </LiffAuthGate>
        </QueryProvider>
      </body>
    </html>
  );
}
