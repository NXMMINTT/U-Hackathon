"use client";

import { useEffect, useRef, useState } from "react";

import { type FoxPose, Ring, UBot, UBotFace, type UBotMood } from "@/components/brand";

const DEFAULT_TIPS = [
  "ส่งสลิปมาได้เลย เดี๋ยวหนูจดให้ค่ะ",
  "พิมพ์ “สรุป” แล้วหนูบอกกำไรวันนี้ให้",
  "เก็บใบเสร็จค่าของไว้นะคะ หักภาษีได้",
  "คู่แข่งขึ้นราคาเมื่อไหร่ หนูจะแอบบอก",
  "อัดเสียงก็ได้ ไม่ต้องพิมพ์ให้เมื่อยมือ",
  "อย่าลืมกินข้าวนะคะ ร้านจะได้ไปต่อ",
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** U-Bot (U-Fox) that leans toward the pointer; clicking makes it cheer and say a tip. */
export function UBotLive({
  size = 140,
  mood = "happy",
  pose,
  wave = false,
  tips = DEFAULT_TIPS,
  className = "",
  bubbleSide = "left",
}: {
  size?: number;
  mood?: UBotMood;
  pose?: FoxPose;
  wave?: boolean;
  tips?: readonly string[];
  className?: string;
  bubbleSide?: "left" | "right";
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [tip, setTip] = useState<{ text: string; n: number } | null>(null);
  const [wink, setWink] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onMove = (e: PointerEvent) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 300);
      setLook({ x: (dx / dist) * k, y: (dy / dist) * k });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (!tip) return;
    const t = setTimeout(() => setTip(null), 4000);
    return () => clearTimeout(t);
  }, [tip]);

  const say = () => {
    setTip((prev) => {
      const pool = tips.filter((t) => t !== prev?.text);
      return { text: pool[Math.floor(Math.random() * pool.length)], n: (prev?.n ?? 0) + 1 };
    });
    setWink(true);
    setTimeout(() => setWink(false), 600);
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <button
        ref={ref}
        type="button"
        onClick={say}
        aria-label="กดคุยกับ U-Bot"
        className="block cursor-pointer rounded-full border-0 bg-transparent p-0 transition-transform hover:-rotate-6 active:scale-95"
      >
        <UBot size={size} mood={mood} pose={wink ? "cheer" : pose} wave={wave} look={look} />
      </button>
      <span aria-live="polite" className={`pointer-events-none absolute -top-4 z-[2] w-max max-w-[220px] ${bubbleSide === "left" ? "right-[85%]" : "left-[85%]"}`}>
        {tip && (
          <span
            key={tip.n}
            className={`block animate-pop rounded-2xl bg-white px-4 py-2.5 font-hand text-[15px] font-semibold leading-snug text-ink shadow-[0_10px_24px_rgba(21,48,90,.16)] ${
              bubbleSide === "left" ? "rounded-br-sm" : "rounded-bl-sm"
            }`}
          >
            {tip.text}
          </span>
        )}
      </span>
    </span>
  );
}

/** U-Bot asks, the seller answers — typed out when scrolled into view (instant without JS or with reduced motion). */
export function TypingChat({ bot, user }: { bot: string; user: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(3); // 0 hidden, 1 typing, 2 bot, 3 bot + user
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen: leave it shown
    setStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setStep(1);
        timers.push(setTimeout(() => setStep(2), 1100), setTimeout(() => setStep(3), 1900));
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={ref} className="flex min-h-[124px] flex-col items-center gap-2.5 px-6 pb-14">
      <div className={`flex items-end gap-2.5 ${step === 0 ? "invisible" : ""}`}>
        <UBotFace />
        {step === 1 ? (
          <span className="flex gap-1.5 rounded-[20px] rounded-bl-md bg-white px-5 py-4 shadow-[0_4px_14px_rgba(26,111,214,.08)]" aria-label="U-Bot กำลังพิมพ์">
            {[0, 150, 300].map((d) => (
              <span key={d} className="h-2 w-2 animate-typing rounded-full bg-brand-light" style={{ animationDelay: `${d}ms` }} />
            ))}
          </span>
        ) : (
          <span className={`rounded-[20px] rounded-bl-md bg-white px-[18px] py-2.5 shadow-[0_4px_14px_rgba(26,111,214,.08)] ${step === 2 ? "animate-pop" : ""}`}>{bot}</span>
        )}
      </div>
      <span className={`ml-28 rounded-[20px] rounded-br-md bg-chat px-[18px] py-2.5 text-[#0F2A12] ${step < 3 ? "invisible" : "animate-pop"}`}>{user}</span>
    </div>
  );
}

const THRESHOLD = 1_800_000;
const ZONES = [
  { upTo: 0.6, mood: "happy", color: "#34C27A", chip: "bg-[#E6F7EE] text-[#0F6B42]", label: "โซนเขียว", say: "ชิลๆ ยังห่างเพดานอีกเยอะค่ะ ขายต่อเลย!" },
  { upTo: 0.9, mood: "worried", color: "#FFC83D", chip: "bg-sun-soft text-sun-ink", label: "โซนเหลือง", say: "เริ่มใกล้แล้วนะ เก็บใบเสร็จค่าของไว้ให้ครบค่ะ" },
  { upTo: 1, mood: "shocked", color: "#F26B5B", chip: "bg-[#FDECEC] text-expense", label: "โซนแดง", say: "ใกล้มากแล้ว! เตรียมเอกสารจด VAT ได้เลยค่ะ" },
  { upTo: Infinity, mood: "shocked", color: "#F26B5B", chip: "bg-[#FDECEC] text-expense", label: "เกินเพดาน", say: "เกินแล้ว ต้องจด VAT ภายใน 30 วันนับจากวันที่เกินนะคะ" },
] as const;

/** Drag your yearly sales and watch the tax meter (and U-Bot's face) react. */
export function TaxPlayground() {
  const [sales, setSales] = useState(1_250_000);
  const ratio = sales / THRESHOLD;
  const zone = ZONES.find((z) => ratio < z.upTo) ?? ZONES[ZONES.length - 1];

  return (
    <div className="relative flex w-[340px] max-w-full flex-col items-center gap-4 rounded-[30px] bg-white p-7 shadow-[0_24px_50px_rgba(21,48,90,.14)] md:rotate-1">
      <span className="absolute -top-5 left-6 -rotate-6 rounded-lg bg-sun px-3 py-1 font-hand font-bold text-[#4A3500] shadow-md">ลองเลื่อนดูสิ!</span>
      <div className="flex items-center gap-3">
        <UBot size={96} mood={zone.mood} />
        <p className="m-0 min-h-[3.2em] max-w-[200px] font-hand text-[15px] font-semibold leading-snug" aria-live="polite">
          {zone.say}
        </p>
      </div>
      <Ring ratio={ratio} color={zone.color} size={170}>
        <div className="text-4xl font-bold leading-none">{Math.round(ratio * 100)}%</div>
        <div className="text-[13px] text-ink-muted">ของเพดาน VAT</div>
      </Ring>
      <span className={`rounded-full px-3 py-0.5 text-sm font-bold ${zone.chip}`}>{zone.label}</span>
      <label className="flex w-full flex-col gap-1.5 text-[15px]">
        <span className="flex justify-between">
          <span className="text-ink-muted">ยอดขายทั้งปี</span>
          <b>฿{sales.toLocaleString("en-US")}</b>
        </span>
        <input
          type="range"
          min={0}
          max={2_000_000}
          step={10_000}
          value={sales}
          onChange={(e) => setSales(Number(e.target.value))}
          className="h-11 w-full cursor-pointer accent-brand"
        />
      </label>
    </div>
  );
}

/** Endless strip of things people actually type to U-Bot. */
export function ChatMarquee({ items }: { items: readonly string[] }) {
  const row = [...items, ...items];
  return (
    <div className="group relative overflow-hidden py-2" aria-label={`ตัวอย่างข้อความ: ${items.join(", ")}`}>
      <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]" aria-hidden="true">
        {row.map((t, i) => (
          <span
            key={i}
            className={`whitespace-nowrap rounded-2xl px-4 py-2 text-[15px] ${i % 3 === 1 ? "rounded-bl-sm bg-white text-ink" : "rounded-br-sm bg-chat text-[#0F2A12]"}`}
            style={{ transform: `rotate(${(i % 4) - 1.5}deg)` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
