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
