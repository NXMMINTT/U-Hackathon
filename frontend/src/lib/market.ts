import type { Competitor } from "@/hooks/useMarket";

/** Demo-only conversion rates to THB for comparing foreign listings —
 * approximate, not live; the UI labels converted prices as estimates. */
const THB_PER_UNIT: Record<string, number> = {
  THB: 1,
  USD: 36,
  EUR: 39,
  JPY: 0.24,
  KRW: 0.026,
  IDR: 0.0022,
  AED: 9.8,
};

export function toTHB(amount: number | null, currency: string): number | null {
  const rate = THB_PER_UNIT[currency];
  return amount === null || rate === undefined ? null : Math.round(amount * rate);
}

export function isAvailable(c: Competitor): boolean {
  return c.price !== null && c.stock === "มีสินค้า";
}

/** Keyword → emoji, checked in order (first match wins) so a quick visual
 * stands in for a product photo in lists — no licensed product photography
 * to source for a hackathon demo, but a plain numbered row is hard to scan. */
const PRODUCT_EMOJI: [string, string][] = [
  ["น้ำพริก", "🌶️"],
  ["พริก", "🌶️"],
  ["กล้วย", "🍌"],
  ["ชา", "🍵"],
  ["กาแฟ", "☕"],
  ["ข้าว", "🍚"],
  ["สบู่", "🧼"],
  ["เซรั่ม", "🧴"],
  ["กันแดด", "🧴"],
  ["ลิป", "💄"],
  ["คุชชั่น", "💄"],
  ["กระเป๋า", "👜"],
  ["เป้", "🎒"],
  ["ผ้าขาวม้า", "🧵"],
  ["ผ้า", "🧵"],
  ["เสื้อ", "👕"],
  ["เดรส", "👗"],
  ["ชุด", "👗"],
  ["กางเกง", "👖"],
  ["รองเท้า", "👟"],
  ["นาฬิกา", "⌚"],
  ["แว่น", "🕶️"],
  ["หูฟัง", "🎧"],
  ["ลำโพง", "🔊"],
  ["พาวเวอร์แบงก์", "🔋"],
  ["สายชาร์จ", "🔌"],
  ["หม้อทอด", "🍳"],
  ["พัดลม", "🌀"],
  ["ดูดฝุ่น", "🧹"],
  ["กาต้มน้ำ", "☕"],
  ["กล้อง", "📷"],
  ["ไฟริงไลท์", "💡"],
  ["เมมโมรี่การ์ด", "💾"],
  ["ตัวต่อ", "🧩"],
  ["ขวดนม", "🍼"],
  ["ผ้าอ้อม", "👶"],
  ["รถเข็นเด็ก", "🚼"],
  ["แมว", "🐱"],
  ["สัตว์เลี้ยง", "🐾"],
  ["หน้ากากอนามัย", "😷"],
  ["แอลกอฮอล์", "🧴"],
  ["ความดัน", "🩺"],
  ["วิตามิน", "💊"],
  ["สร้อย", "📿"],
  ["ต่างหู", "💎"],
  ["แหวน", "💍"],
  ["กำไล", "📿"],
  ["ผ้าปูที่นอน", "🛏️"],
  ["หมอน", "🛏️"],
  ["กล่องเก็บของ", "📦"],
  ["ม่าน", "🪟"],
  ["เคสมือถือ", "📱"],
  ["ฟิล์มกระจก", "📱"],
  ["แท็บเล็ต", "📱"],
  ["มือถือ", "📱"],
  ["เมาส์", "🖱️"],
  ["คีย์บอร์ด", "⌨️"],
  ["โน้ตบุ๊ก", "💻"],
  ["ฮับ", "🔌"],
  ["ดัมเบล", "🏋️"],
  ["โยคะ", "🧘"],
  ["ขวดน้ำ", "🧴"],
  ["จักรยาน", "🚲"],
  ["จอย", "🎮"],
  ["เก้าอี้เกมมิ่ง", "🎮"],
  ["แผ่นรองเมาส์", "🖱️"],
];

/** Best-effort product emoji from a Thai product name, for list rows that
 * have no category context. Falls back to a generic package box. */
export function productEmoji(name: string): string {
  const hit = PRODUCT_EMOJI.find(([kw]) => name.includes(kw));
  return hit ? hit[1] : "📦";
}

const LOGOS: Record<string, string> = {
  shopee: "/logos/shopee.webp",
  lazada: "/logos/lazada.jpg",
  amazon: "/logos/amazon.jpg",
  ebay: "/logos/ebay.png",
  thaimart: "/logos/thaimart.jpg",
  // Brand marks below are Simple Icons (CC0) SVGs, not official downloads —
  // see mock-data/README.md for platforms that don't have one (letter badge instead).
  tiktok: "/logos/tiktok.svg",
  line: "/logos/line.svg",
  facebook: "/logos/facebook.svg",
  instagram: "/logos/instagram.svg",
  grab: "/logos/grab.svg",
  bukalapak: "/logos/bukalapak.svg",
  etsy: "/logos/etsy.svg",
  walmart: "/logos/walmart.svg",
  target: "/logos/target.svg",
  aliexpress: "/logos/aliexpress.svg",
  alibaba: "/logos/alibaba.svg",
  wish: "/logos/wish.svg",
  zalando: "/logos/zalando.svg",
  otto: "/logos/otto.svg",
  allegro: "/logos/allegro.svg",
  rakuten: "/logos/rakuten.svg",
  yahoo: "/logos/yahoo.svg",
  taobao: "/logos/taobao.svg",
  flipkart: "/logos/flipkart.svg",
  blibli: "/logos/blibli.svg",
};

/** Logo for a platform id like "shopee_th" / "amazon_us", or null for a letter badge. */
export function platformLogo(platformIdOrName: string): string | null {
  const key = platformIdOrName.toLowerCase().replace(/[^a-z].*$/, "");
  return LOGOS[key] ?? null;
}

/** Fixed colors per platform so the same platform reads the same in every chart.
 * Validated with the dataviz skill's validate_palette.js (light mode, all pairs): all checks pass;
 * the orange is < 3:1 on white, so lines also carry direct labels. */
export const PLATFORM_COLORS: Record<string, string> = {
  Shopee: "#1F5FBF",
  Lazada: "#14A0B8",
  "TikTok Shop": "#D9891A",
  Thaimart: "#C2416B",
  Amazon: "#7A5C00",
};
export const FALLBACK_COLOR = "#5A667A";

export function platformColor(name: string): string {
  return PLATFORM_COLORS[name] ?? FALLBACK_COLOR;
}

export type TrendStatus = "hot" | "rising" | "stable" | "slowing";

/** Search-growth bands from NIGHT's trend page: >=80% hot, 30-79% rising, 0-29% stable, < 0 slowing. */
export function trendStatus(growthPct: number): TrendStatus {
  return growthPct >= 80 ? "hot" : growthPct >= 30 ? "rising" : growthPct >= 0 ? "stable" : "slowing";
}

export const TREND_STATUS_TONE = { hot: "warning", rising: "info", stable: "neutral", slowing: "neutral" } as const;

export function formatGrowth(pct: number): string {
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

const PICKED_KEY = "mr-platforms";

/** Platforms chosen on /market/platforms (per-viewer convenience, so localStorage). */
export function loadPickedPlatforms(): string[] | null {
  try {
    const raw = window.localStorage.getItem(PICKED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

export function savePickedPlatforms(ids: string[]): void {
  try {
    window.localStorage.setItem(PICKED_KEY, JSON.stringify(ids));
  } catch {
    // storage blocked (private mode) — the choice just isn't remembered
  }
}
