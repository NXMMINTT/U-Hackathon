export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "success" | "warning" | "danger" | "info" | "neutral";
}) {
  const toneClasses = {
    success: "bg-[#ECFDF5] text-[#047857]",
    warning: "bg-[#FFEBC8] text-[#6B4E16]",
    danger: "bg-[#FEE2E2] text-[#991B1B]",
    info: "bg-[#DCEAF8] text-[#1E40AF]",
    neutral: "bg-line-subtle text-ink-body",
  }[tone];

  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneClasses}`}>
      {children}
    </span>
  );
}
