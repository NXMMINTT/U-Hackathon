"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { UBot } from "@/components/brand";
import { Card } from "@/components/ui/Card";
import { type TransactionUpdate, useTransactionActions } from "@/hooks/useDashboard";

const CATEGORIES = [
  { id: "food", label: "อาหาร", icon: "🍽️", color: "bg-[#FFF3E0]", activeColor: "bg-[#FF9800] text-white" },
  { id: "beverage", label: "เครื่องดื่ม", icon: "🚗", color: "bg-[#F3E5F5]", activeColor: "bg-[#9C27B0] text-white" },
  { id: "shopping", label: "ช้อปปิ้ง", icon: "🛍️", color: "bg-[#E8F5E9]", activeColor: "bg-[#4CAF50] text-white" },
  { id: "transport", label: "ขนส่ง", icon: "🚚", color: "bg-[#E3F2FD]", activeColor: "bg-[#2196F3] text-white" },
  { id: "other", label: "อื่นๆ", icon: "•••", color: "bg-[#F5F5F5]", activeColor: "bg-[#757575] text-white" },
];

function formatThaiDate(date: string) {
  const d = new Date(date);
  const day = d.getDate();
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

function TransactionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") === "income" ? "income" : "expense";
  const isIncome = mode === "income";

  const { update } = useTransactionActions();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [note, setNote] = useState("");
  const [txnDate, setTxnDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!amount || !description) return;
    setSubmitting(true);
    setError(null);
    try {
      const body: TransactionUpdate = {
        type: mode,
        amount: amount,
        description: description || null,
        txn_date: txnDate,
        product_name: null,
        quantity: null,
      };
      await update.mutateAsync({ id: 0, body });
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header with mascot */}
      <section className="relative rounded-[28px] bg-gradient-to-br from-[#E0F2FE] to-[#F0F7FF] px-6 py-5 overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-bold text-navy leading-snug m-0">
              {isIncome ? "บันทึกรายรับกันเลยครับ!" : "บันทึกรายจ่ายกันเลยครับ!"}
            </p>
            <p className="text-[14px] text-ink-muted mt-1 m-0 leading-snug">
              เลือกหมวดหมู่ แล้วใส่จำนวนเงิน<br />ได้เลยครับ
            </p>
          </div>
          <UBot size={90} pose="ledger" className="shrink-0 -mr-2" />
        </div>
      </section>

      {/* Form */}
      <section className="rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3 mb-6">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${isIncome ? "bg-[#E8F5E9]" : "bg-[#FFEBEE]"}`}>
            {isIncome ? "💰" : "💸"}
          </span>
          <h2 className="text-xl font-bold text-navy m-0">
            {isIncome ? "รายรับ" : "รายจ่าย"}
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {/* Date */}
          <div>
            <label className="text-[14px] font-semibold text-ink-body mb-1.5 block">วันที่</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">📅</span>
              <input
                type="date"
                value={txnDate}
                onChange={(e) => setTxnDate(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-line bg-white pl-10 pr-4 text-[15px] text-ink"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[14px] font-semibold text-ink-body mb-1.5 block">รายการ</label>
            <div className="relative">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isIncome ? "เช่น ขายของออนไลน์" : "เช่น กินกาแฟ"}
                className="w-full min-h-[48px] rounded-xl border border-line bg-white px-4 pr-10 text-[15px] text-ink placeholder:text-ink-faint"
              />
              {description && (
                <button
                  type="button"
                  onClick={() => setDescription("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-line-subtle flex items-center justify-center text-ink-muted text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-[14px] font-semibold text-ink-body mb-1.5 block">จำนวนเงิน</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand font-bold text-lg">฿</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full min-h-[48px] rounded-xl border border-line bg-white pl-10 pr-4 text-[18px] font-semibold text-ink placeholder:text-ink-faint"
              />
            </div>
          </div>

          {/* Category */}
          {!isIncome && (
            <div>
              <label className="text-[14px] font-semibold text-ink-body mb-2 block">หมวดหมู่</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 min-w-[72px] transition-all ${
                      category === cat.id ? cat.activeColor : cat.color
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-[11px] font-semibold whitespace-nowrap">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="text-[14px] font-semibold text-ink-body mb-1.5 flex items-center gap-1.5 block">
              <span>✏️</span> เพิ่มโน้ต (ถ้ามี)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={description || "รายละเอียดเพิ่มเติม"}
              className="w-full min-h-[48px] rounded-xl border border-line bg-white px-4 text-[15px] text-ink placeholder:text-ink-faint"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm text-expense">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 min-h-[52px] rounded-full border-2 border-line bg-white text-[16px] font-bold text-ink-body"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !amount || !description}
            className={`flex-1 min-h-[52px] rounded-full text-[16px] font-bold text-white disabled:opacity-50 ${
              isIncome ? "bg-income" : "bg-[#FF4081]"
            }`}
          >
            {isIncome ? "บันทึกรายรับ" : "บันทึกรายจ่าย"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<Card className="text-center text-sm text-ink-muted">กำลังโหลด…</Card>}>
      <TransactionForm />
    </Suspense>
  );
}
