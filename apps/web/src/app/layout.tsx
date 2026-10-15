import type { Metadata } from "next";
import Link from "next/link";

import { QueryProvider } from "@/components/QueryProvider";
import th from "@/locales/th.json";

import "./globals.css";

export const metadata: Metadata = {
  title: "U-Ledger AI",
  description: "Financial OS สำหรับ SME",
};

const NAV_ITEMS = [
  { href: "/", label: th.nav.health },
  { href: "/transactions", label: th.nav.transactions },
  { href: "/tax", label: th.nav.tax },
  { href: "/trends", label: th.nav.trends },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen">
        <QueryProvider>
          <div className="mx-auto flex min-h-screen max-w-md flex-col">
            <main className="flex-1 overflow-y-auto p-4 pb-20">{children}</main>
            <nav className="fixed bottom-0 left-0 right-0 mx-auto flex max-w-md border-t border-gray-200 bg-white">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex-1 py-3 text-center text-sm text-gray-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
