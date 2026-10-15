"use client";

import {
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CompetitorPrices } from "@/hooks/useMarket";
import { toTHB } from "@/lib/market";
import th from "@/locales/th.json";

const t = th.marketRadar.overview;

type Point = { price: number; market: string; seller: string; platform: string; original: string; stock: string };

function RadarTooltip({ active, payload }: { active?: boolean; payload?: { payload: Point }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-[10px] border border-line bg-white px-3 py-2 text-xs shadow-sm">
      <div className="font-semibold text-navy">{p.seller}</div>
      <div className="text-ink-muted">
        {p.platform} · {p.original}
      </div>
      <div className="font-semibold text-navy">≈ ฿{p.price.toLocaleString("en-US")}</div>
      <div className="text-ink-muted">{p.stock}</div>
    </div>
  );
}

/** Competitor price distribution with the shop's own cost and price pinned (spec 2.2). */
export function PriceRadarChart({ data }: { data: CompetitorPrices }) {
  const points: (Point & { inStock: boolean })[] = data.competitors.flatMap((c) => {
    const price = toTHB(c.price, c.currency);
    if (price === null) return [];
    const market = c.currency === "THB" ? t.thaiMarket : t.abroad;
    const original = c.currency === "THB" ? `฿${c.price}` : `${c.price} ${c.currency}`;
    return [{ price, market, seller: c.seller, platform: c.platform, original, stock: c.stock, inStock: c.stock === "มีสินค้า" }];
  });
  const dist = data.price_distribution_thb;

  return (
    <>
      <ResponsiveContainer width="100%" height={240}>
        <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="#F1F4F8" horizontal={false} />
          <XAxis
            type="number"
            dataKey="price"
            name="price"
            tickFormatter={(v: number) => `฿${v}`}
            tick={{ fontSize: 11, fill: "#5A667A" }}
            axisLine={{ stroke: "#E3E8EF" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="market"
            allowDuplicatedCategory={false}
            width={110}
            tick={{ fontSize: 12, fill: "#33415A" }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceArea x1={dist.p25} x2={dist.p75} fill="#DCE8F7" fillOpacity={0.6} />
          <ReferenceLine
            x={data.my_cost_price}
            stroke="#D9891A"
            strokeWidth={2}
            strokeDasharray="4 3"
            label={{ value: `ต้นทุน ฿${data.my_cost_price}`, position: "insideTopRight", fontSize: 11, fill: "#33415A" }}
          />
          <ReferenceLine
            x={data.my_selling_price}
            stroke="#13294B"
            strokeWidth={2}
            label={{ value: `ราคาคุณ ฿${data.my_selling_price}`, position: "insideTopLeft", fontSize: 11, fill: "#13294B" }}
          />
          <Tooltip content={<RadarTooltip />} cursor={{ stroke: "#CBD5E1" }} />
          <Scatter name="มีสินค้า" data={points.filter((p) => p.inStock)} fill="#1F5FBF" stroke="#FFFFFF" strokeWidth={2} />
          <Scatter name="สินค้าหมด" data={points.filter((p) => !p.inStock)} fill="#FFFFFF" stroke="#5A667A" strokeWidth={2} />
        </ScatterChart>
      </ResponsiveContainer>
      {/* HTML legend: Recharts' Legend drops the hollow out-of-stock series. */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-ink-body">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          มีสินค้า
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-ink-faint bg-white" />
          สินค้าหมด
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 bg-[#DCE8F7]" />
          ช่วงราคา 50% กลาง (ไทย)
        </span>
      </div>
    </>
  );
}
