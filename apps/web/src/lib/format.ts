// Mirrors apps/api/app/core/formatting.py — keep both in sync.

const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

/** Backend API responses send amounts as decimal strings — parse with this, not `Number()` directly. */
export function formatTHB(amount: string | number): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return `฿${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Thai (พ.ศ.) date display, e.g. "15 ต.ค. 2569". API requests/responses stay ISO 8601 (ค.ศ.). */
export function formatThaiDate(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}
