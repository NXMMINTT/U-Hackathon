import { InfoRow } from "@/components/home/phone/InfoRow";

/** Radar step 3: trending search terms and an export opportunity. */
export function KeywordScreen() {
  return (
    <div className="flex h-full flex-col gap-2.5 bg-white px-3.5 py-[18px]">
      <b className="text-sm">คำค้นยอดฮิต · 30 วัน</b>
      <div className="flex flex-col gap-1.5">
        {[["น้ำพริกตาแดง", "+38%"], ["น้ำพริกคลีน", "+22%"], ["น้ำพริกกระปุกของฝาก", "+15%"], ["น้ำพริกเผาโบราณ", "+9%"]].map(([k, v], i) => (
          <div key={k} className="flex items-center gap-2 rounded-lg bg-brand-tint px-2 py-1.5">
            <span className="w-4 font-bold text-brand">{i + 1}</span>
            <span className="flex-1">{k}</span>
            <b className="text-income">{v}</b>
          </div>
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-1 rounded-[14px] border border-line p-2.5">
        <span className="self-start rounded-full bg-brand-soft px-2 text-[10px] font-bold text-brand">โอกาสส่งออก · ยุโรป</span>
        <b>“Thai chili paste”</b>
        <InfoRow k="ความต้องการ" v={<span className="text-income">เพิ่มขึ้น</span>} />
        <InfoRow k="ราคาเฉลี่ย" v="€6.50 / กระปุก" />
      </div>
    </div>
  );
}
