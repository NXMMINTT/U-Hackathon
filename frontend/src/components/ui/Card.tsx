import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-white p-5 md:px-6 md:py-[22px] ${className}`}>
      {children}
    </div>
  );
}
