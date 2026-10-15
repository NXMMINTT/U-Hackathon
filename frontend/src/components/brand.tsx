import Link from "next/link";

/** U-Fox poses cut from the team's sticker sheet (public/mascot/u-fox-<pose>.png). */
export type FoxPose =
  | "wave" | "happy" | "cheer" | "love" | "question" | "shocked" | "sleep" | "proud"
  | "ledger" | "radar" | "global" | "commerce" | "idea" | "line" | "icon-round" | "icon-app" | "logo";

export type UBotMood = "happy" | "worried" | "shocked" | "wink";

const MOOD_POSE: Record<UBotMood, FoxPose> = { happy: "happy", wink: "cheer", worried: "question", shocked: "shocked" };

/** U-Bot as U-Fox, the project mascot. Pick a `pose`, or a `mood` (happy / wink / worried / shocked);
 * `wave` uses the waving pose; `look` (-1..1) tilts the fox toward the pointer. Decorative — callers label the context. */
export function UBot({
  size = 120,
  wave = false,
  mood = "happy",
  pose,
  look = { x: 0, y: 0 },
  className = "",
}: {
  size?: number;
  wave?: boolean;
  mood?: UBotMood;
  pose?: FoxPose;
  look?: { x: number; y: number };
  className?: string;
}) {
  const p = pose ?? (wave && mood === "happy" ? "wave" : MOOD_POSE[mood]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/mascot/u-fox-${p}.png`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      draggable={false}
      className={`object-contain ${className}`}
      style={{ width: size, height: size, transform: `rotate(${look.x * 6}deg) translateY(${look.y * 3}px)`, transition: "transform .2s ease-out" }}
    />
  );
}

/** Round U-Fox avatar used as the logo mark and chat avatar. */
export function UBotFace({ size = 40 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/mascot/u-fox-icon-round.png" alt="" aria-hidden="true" width={size} height={size} className="shrink-0 rounded-full" style={{ width: size, height: size }} />
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 text-[21px] font-extrabold tracking-tight text-navy no-underline">
      <UBotFace size={40} />
      <span>
        <span className="text-brand">U</span>-Ledger AI<span className="text-brand-light">✦</span>
      </span>
    </Link>
  );
}

/** Set NEXT_PUBLIC_LINE_ADD_FRIEND_URL to the OA's https://line.me/R/ti/p/@… link. */
export const LINE_ADD_FRIEND_URL = process.env.NEXT_PUBLIC_LINE_ADD_FRIEND_URL ?? "#";

export function LineAddFriendButton({ label = "เพิ่มเพื่อน", className = "" }: { label?: string; className?: string }) {
  return (
    <a
      href={LINE_ADD_FRIEND_URL}
      className={`inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-linegreen px-7 font-bold text-white no-underline shadow-[0_10px_24px_rgba(6,199,85,.3)] hover:bg-[#05B34C] ${className}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s5.9-3.5 8.1-6C21.4 14.3 22 12.7 22 11c0-4.4-4.5-8-10-8z" />
      </svg>
      {label}
    </a>
  );
}

/** Ring gauge (0–1) used by the tax meter. */
export function Ring({ ratio, size = 150, color = "#FFC83D", children }: { ratio: number; size?: number; color?: string; children?: React.ReactNode }) {
  const r = 74;
  const dash = Math.max(0, Math.min(1, ratio)) * 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 180 180" className="block h-full w-full" aria-hidden="true">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#EAF3FF" strokeWidth="18" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={`${dash} 1000`}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">{children}</div>
    </div>
  );
}
