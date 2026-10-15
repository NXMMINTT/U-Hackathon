import th from "@/locales/th.json";

/** Tab 2 (Premium) — not built yet. */
export default function MarketRadarPage() {
  return (
    <div className="flex flex-col gap-[22px]">
      <h1 className="text-2xl font-bold md:text-[30px]">{th.marketRadar.title}</h1>
      <section className="flex flex-col gap-2.5 rounded-2xl border-2 border-brand bg-brand-tint p-[22px]">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </span>
          <span className="text-[17px] font-semibold">{th.marketRadar.premium}</span>
        </div>
        <p className="text-sm text-ink-body">{th.marketRadar.comingSoon}</p>
      </section>
    </div>
  );
}
