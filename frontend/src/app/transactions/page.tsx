"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { type TransactionItem, useTransactionActions, useTransactions } from "@/hooks/useDashboard";
import { formatQty, formatTHB, formatThaiDate } from "@/lib/format";
import th from "@/locales/th.json";

const STATUS_TONE = { pending: "warning", confirmed: "success", cancelled: "neutral" } as const;
const f = th.transactions.form;
const a = th.transactions.actions;
const inputClass = "min-h-[44px] rounded-[10px] border border-line px-3 text-base";

/** Edit form for a pending transaction — opened from the LINE card's "แก้ไข" (LIFF) via ?edit=<id>. */
function EditForm({ txn, onClose }: { txn: TransactionItem; onClose: () => void }) {
  const { update, confirm } = useTransactionActions();
  const [type, setType] = useState(txn.type);
  const [amount, setAmount] = useState(String(Number(txn.amount)));
  const [description, setDescription] = useState(txn.description ?? "");
  const [txnDate, setTxnDate] = useState(txn.txn_date);
  const [product, setProduct] = useState(txn.product_name ?? "");
  const [quantity, setQuantity] = useState(txn.quantity ? String(Number(txn.quantity)) : "");
  const error = update.error ?? confirm.error;

  const save = () =>
    update.mutateAsync({
      id: txn.id,
      body: {
        type,
        amount,
        description: description || null,
        txn_date: txnDate,
        product_name: product.trim() || null,
        quantity: product.trim() && quantity ? quantity : null,
      },
    });

  return (
    <Card className="flex flex-col gap-4 border-2 border-brand">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{f.title}</h2>
        <button type="button" onClick={onClose} className="text-sm text-ink-muted">
          {a.close}
        </button>
      </div>
      {txn.status !== "pending" ? (
        <p className="text-sm text-ink-muted">{f.pendingOnly}</p>
      ) : (
        <form
          className="flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await save();
          }}
        >
          <div role="radiogroup" aria-label={f.type} className="flex gap-2">
            {(["income", "expense"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={type === value}
                onClick={() => setType(value)}
                className={`min-h-[40px] flex-1 rounded-[10px] text-sm font-semibold ${
                  type === value
                    ? value === "income"
                      ? "bg-income text-white"
                      : "bg-expense text-white"
                    : "bg-line-subtle text-ink-body"
                }`}
              >
                {f[value]}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink-muted">{f.amount}</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink-muted">{f.date}</span>
              <input type="date" required value={txnDate} onChange={(e) => setTxnDate(e.target.value)} className={inputClass} />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-ink-muted">{f.description}</span>
            <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} className={inputClass} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink-muted">{f.product}</span>
              <input value={product} onChange={(e) => setProduct(e.target.value)} maxLength={200} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink-muted">{f.quantity}</span>
              <input
                type="number"
                min="0.001"
                step="any"
                value={quantity}
                disabled={!product.trim()}
                onChange={(e) => setQuantity(e.target.value)}
                className={`${inputClass} disabled:bg-line-subtle`}
              />
            </label>
          </div>
          {error && <p className="rounded-[10px] bg-[#FEF2F2] px-3 py-2 text-sm text-[#991B1B]">{error.message}</p>}
          {update.isSuccess && !confirm.isSuccess && <p className="text-sm text-income">{f.saved}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={update.isPending}
              className="min-h-[44px] rounded-xl border-[1.5px] border-brand px-5 text-sm font-semibold text-brand disabled:opacity-50"
            >
              {a.save}
            </button>
            <button
              type="button"
              disabled={update.isPending || confirm.isPending}
              onClick={async () => {
                await save();
                await confirm.mutateAsync(txn.id);
                onClose();
              }}
              className="min-h-[44px] rounded-xl bg-brand px-5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {a.save} + {a.confirm}
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}

function TransactionsView() {
  const router = useRouter();
  const params = useSearchParams();
  const { data, isLoading, error } = useTransactions();
  const { confirm, cancel } = useTransactionActions();
  const editId = Number(params.get("edit")) || null;
  const editing = data?.find((t) => t.id === editId);
  const openEdit = (id: number | null) => router.replace(id ? `/transactions?edit=${id}` : "/transactions", { scroll: false });
  const actionError = confirm.error ?? cancel.error;

  return (
    <div className="flex flex-col gap-[22px]">
      <h1 className="text-2xl font-bold md:text-[30px]">{th.transactions.title}</h1>
      {error && <Card className="border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">{error.message}</Card>}
      {actionError && <Card className="border-[#FECACA] bg-[#FEF2F2] text-sm text-[#991B1B]">{actionError.message}</Card>}
      {isLoading && <Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>}
      {data?.length === 0 && <Card className="text-center text-sm text-ink-muted">{th.transactions.empty}</Card>}

      {editing && <EditForm key={editing.id} txn={editing} onClose={() => openEdit(null)} />}

      {data && data.length > 0 && (
        <Card className="flex flex-col divide-y divide-line-subtle !p-0">
          {data.map((t) => {
            const isIncome = t.type === "income";
            return (
              <div key={t.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 md:px-6">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-semibold">{t.description ?? "-"}</span>
                  <span className="text-xs text-ink-muted">
                    {formatThaiDate(t.txn_date)} · {t.category ?? "-"} · {th.transactions.source[t.source]}
                    {t.product_name && t.quantity && ` · ${t.product_name} ×${formatQty(t.quantity)}`}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-sm font-semibold ${isIncome ? "text-income" : "text-expense"}`}>
                    {isIncome ? "+" : "-"}
                    {formatTHB(t.amount)}
                  </span>
                  {t.status !== "confirmed" && <Badge tone={STATUS_TONE[t.status]}>{th.transactions.status[t.status]}</Badge>}
                </div>
                {t.status === "pending" && (
                  <div className="flex w-full justify-end gap-2">
                    {[
                      { label: a.edit, onClick: () => openEdit(t.id), cls: "border border-line text-ink-body" },
                      { label: a.cancel, onClick: () => cancel.mutate(t.id), cls: "border border-line text-ink-body" },
                      { label: a.confirm, onClick: () => confirm.mutate(t.id), cls: "bg-brand text-white" },
                    ].map((b) => (
                      <button
                        key={b.label}
                        type="button"
                        onClick={b.onClick}
                        disabled={confirm.isPending || cancel.isPending}
                        className={`min-h-[36px] rounded-[10px] px-3 text-xs font-semibold disabled:opacity-50 ${b.cls}`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

export default function TransactionsPage() {
  // useSearchParams needs a Suspense boundary for static rendering.
  return (
    <Suspense fallback={<Card className="text-center text-sm text-ink-muted">{th.myBusiness.loading}</Card>}>
      <TransactionsView />
    </Suspense>
  );
}
