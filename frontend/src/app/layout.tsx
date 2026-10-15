import type { Metadata } from "next";
import { Prompt } from "next/font/google";

import { NavTabs, SiteHeader } from "@/components/NavTabs";
import { QueryProvider } from "@/components/QueryProvider";

import "./globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "U-Ledger AI",
  description: "Financial OS สำหรับ SME",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={prompt.variable}>
      <body className="min-h-screen font-sans">
        <QueryProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto w-full max-w-[1360px] flex-1 px-4 pb-24 pt-5 md:px-8 md:pb-14 md:pt-7">
              {children}
            </main>
            <NavTabs />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
