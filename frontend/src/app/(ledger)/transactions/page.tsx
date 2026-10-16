"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { TransactionEntryForm } from "@/components/transactions/TransactionEntryForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Card } from "@/components/ui/Card";

/**
 * /transactions                 → latest entries (pending ones can be confirmed/cancelled)
 * /transactions?edit=<id>       → same list with that pending entry open for editing (LINE card's "แก้ไข")
 * /transactions?mode=income|expense → form for a new entry (dashboard menu)
 */
function TransactionsView() {
  const params = useSearchParams();
  const mode = params.get("mode");
  if (mode === "income" || mode === "expense") return <TransactionEntryForm key={mode} mode={mode} />;
  return <TransactionList />;
}

export default function TransactionsPage() {
  // useSearchParams needs a Suspense boundary for static rendering.
  return (
    <Suspense fallback={<Card className="text-center text-sm text-ink-muted">กำลังโหลด…</Card>}>
      <TransactionsView />
    </Suspense>
  );
}
