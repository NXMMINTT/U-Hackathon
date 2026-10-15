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

const LOGOS: Record<string, string> = {
  shopee: "/logos/shopee.webp",
  lazada: "/logos/lazada.jpg",
  amazon: "/logos/amazon.jpg",
  ebay: "/logos/ebay.png",
  thaimart: "/logos/thaimart.jpg",
};

/** Logo for a platform id like "shopee_th" / "amazon_us", or null for a letter badge. */
export function platformLogo(platformIdOrName: string): string | null {
  const key = platformIdOrName.toLowerCase().replace(/[^a-z].*$/, "");
  return LOGOS[key] ?? null;
}

/** Fixed colors per platform so the same platform reads the same in every chart.
 * Validated with the dataviz skill's validate_palette.js (light mode): all checks pass;
 * the orange is < 3:1 on white, so lines also carry direct labels. */
export const PLATFORM_COLORS: Record<string, string> = {
  Shopee: "#1F5FBF",
  Lazada: "#14A0B8",
  "TikTok Shop": "#D9891A",
};
export const FALLBACK_COLOR = "#5A667A";
