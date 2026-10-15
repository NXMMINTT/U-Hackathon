import { categoryPhoto } from "@/lib/market";

// Tints rotate per category like NIGHT's trend page, so neighbouring tiles differ.
const TINTS = [
  "bg-[#EAF2FC] text-[#1F5FBF]",
  "bg-[#F1F4F8] text-[#33415A]",
  "bg-[#E3EEFB] text-[#174A96]",
  "bg-[#FFF3DD] text-[#8A5A12]",
  "bg-[#EEF4FC] text-[#13294B]",
  "bg-[#E9F7EF] text-[#166534]",
];

export function categoryTint(categoryId: string): string {
  return TINTS[(Number(categoryId.replace(/\D/g, "")) - 1) % TINTS.length];
}

/** Category glyph from the catalog's SVG path, on its tinted tile. */
export function CategoryIcon({
  categoryId,
  path,
  size = 44,
  className = "",
}: {
  categoryId: string;
  path: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`grid flex-none place-items-center rounded-[10px] ${categoryTint(categoryId)} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size / 2}
        height={size / 2}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </span>
  );
}

/** A real product photo for the category when one exists (see
 * public/products/CREDITS.md), falling back to CategoryIcon's SVG glyph
 * otherwise — same size/rounding either way so callers can swap freely. */
export function CategoryThumb({
  categoryId,
  path,
  size = 44,
  className = "",
}: {
  categoryId: string;
  path: string;
  size?: number;
  className?: string;
}) {
  const photo = categoryPhoto(categoryId);
  if (!photo) return <CategoryIcon categoryId={categoryId} path={path} size={size} className={className} />;
  return (
    <span
      className={`grid flex-none place-items-center overflow-hidden rounded-[10px] ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static product photo */}
      <img src={photo} alt="" className="h-full w-full object-cover" />
    </span>
  );
}
