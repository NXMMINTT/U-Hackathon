export function StatCard({
  label,
  value,
  caption,
  tone = "neutral",
}: {
  label: string;
  value: string;
  caption?: string;
  tone?: "primary" | "income" | "expense" | "neutral";
}) {
  if (tone === "primary") {
    return (
      <div className="flex flex-col gap-1 rounded-2xl bg-navy p-5 text-white">
        <span className="text-[13px] text-[#CBD5E1]">{label}</span>
        <span className="text-[28px] font-bold leading-tight">{value}</span>
        {caption && <span className="text-[13px] text-[#6EE7B7]">{caption}</span>}
      </div>
    );
  }

  const valueColor = tone === "income" ? "text-income" : tone === "expense" ? "text-expense" : "text-navy";

  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-line bg-white p-5">
      <span className="text-[13px] text-ink-muted">{label}</span>
      <span className={`text-[28px] font-bold leading-tight ${valueColor}`}>{value}</span>
      {caption && <span className="text-[13px] text-ink-muted">{caption}</span>}
    </div>
  );
}
