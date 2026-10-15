// Hand-drawn bits that make the pages feel made by people: scribbles, stickers, notes, receipt edges.

/** Wavy underline drawn under a word. Wrap the word: <Underline>U-Bot</Underline> */
export function Underline({ children, color = "#FFC83D" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-[1]">{children}</span>
      <svg viewBox="0 0 200 16" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3.5 w-full" aria-hidden="true">
        <path d="M3 10 C 30 3, 50 14, 80 8 S 140 3, 197 9" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** Loose hand-drawn ring around a number or word. */
export function Circled({ children, color = "#F26B5B" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="relative inline-block px-2">
      {children}
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="pointer-events-none absolute -inset-x-1 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+8px)]" aria-hidden="true">
        <path d="M150 8 C 190 14, 200 52, 150 70 C 100 84, 20 76, 8 46 C -2 18, 50 4, 120 6" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** Curly hand-drawn arrow; rotate/flip it with className. */
export function CurlyArrow({ className = "", color = "#2563EB" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 10c20-6 44 2 44 18 0 12-16 14-16 4 0-12 30-18 52 0 10 8 16 18 20 28" />
      <path d="M96 48l10 12 4-15" />
    </svg>
  );
}

/** Handwritten note (Mali), slightly tilted. */
export function Note({ children, className = "", tilt = -4 }: { children: React.ReactNode; className?: string; tilt?: number }) {
  return (
    <span className={`inline-block font-hand font-semibold text-brand ${className}`} style={{ transform: `rotate(${tilt}deg)` }}>
      {children}
    </span>
  );
}

/** Starburst sticker. Wiggles on hover. */
export function Sticker({ children, className = "", tilt = 8, color = "#FFC83D" }: { children: React.ReactNode; className?: string; tilt?: number; color?: string }) {
  return (
    <span className={`group inline-grid place-items-center ${className}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <svg viewBox="0 0 100 100" className="col-start-1 row-start-1 h-full w-full drop-shadow-[0_6px_10px_rgba(21,48,90,.18)] group-hover:animate-wiggle" aria-hidden="true">
        <path
          d="M50 2l9 13 15-6 2 16 16 2-6 15 13 9-13 9 6 15-16 2-2 16-15-6-9 13-9-13-15 6-2-16-16-2 6-15L2 50l13-9-6-15 16-2 2-16 15 6z"
          fill={color}
        />
      </svg>
      {/* relative: the svg's drop-shadow filter would otherwise paint over the text */}
      <span className="relative col-start-1 row-start-1 px-3 text-center font-hand font-bold leading-tight text-[#4A3500]">{children}</span>
    </span>
  );
}

/** Zig-zag bottom edge so a card reads as a torn-off receipt. */
export function ReceiptEdge({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 10" preserveAspectRatio="none" className="block h-3 w-full" aria-hidden="true">
      <path d="M0 0h120v2l-5 8-5-8-5 8-5-8-5 8-5-8-5 8-5-8-5 8-5-8-5 8-5-8-5 8-5-8-5 8-5-8-5 8-5-8-5 8-5-8-5 8-5-8-5 8-5-8-5 8z" fill={color} />
    </svg>
  );
}

/** Little four-point sparkle. */
/** Soft four-point twinkle, as on the U-Fox stickers. */
export function Twinkle({ className = "", color = "#60A5FA" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <path d="M12 0C12.8 7.6 16.4 11.2 24 12C16.4 12.8 12.8 16.4 12 24C11.2 16.4 7.6 12.8 0 12C7.6 11.2 11.2 7.6 12 0Z" fill={color} />
    </svg>
  );
}

/** U-Fox paw print. */
export function Paw({ className = "", color = "#2563EB" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <g fill={color}>
        <ellipse cx="16" cy="22" rx="8" ry="7" />
        <ellipse cx="6" cy="13" rx="3.2" ry="4" transform="rotate(-20 6 13)" />
        <ellipse cx="12.5" cy="7" rx="3.2" ry="4.2" transform="rotate(-6 12.5 7)" />
        <ellipse cx="19.5" cy="7" rx="3.2" ry="4.2" transform="rotate(6 19.5 7)" />
        <ellipse cx="26" cy="13" rx="3.2" ry="4" transform="rotate(20 26 13)" />
      </g>
    </svg>
  );
}

/** Small curl, like the fox's tail flick. */
export function Curl({ className = "", color = "#60A5FA" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <path d="M6 24c-3-6 1-14 9-14 6 0 9 6 5 9-3 2-6 0-5-3" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Sparkle({ className = "", color = "#60A5FA" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill={color} />
    </svg>
  );
}
