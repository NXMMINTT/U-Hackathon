export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "success" | "warning" | "danger" | "info" | "neutral";
}) {
  const toneClasses = {
    success: "bg-[#E6F7EE] text-[#0F6B42]",
    warning: "bg-sun-soft text-sun-ink",
    danger: "bg-[#FDECEC] text-expense",
    info: "bg-brand-soft text-brand",
    neutral: "bg-line-subtle text-ink-body",
  }[tone];

  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-0.5 text-[13px] font-bold ${toneClasses}`}>
      {children}
    </span>
  );
}
