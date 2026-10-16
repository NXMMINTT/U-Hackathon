"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { CatalogPlatform, CatalogProduct } from "@/types/market";
import { platformColor } from "@/lib/market/platformColor";

/** 8-week price history for domestic platforms, one line per platform with a direct end label. */
export function PriceHistoryChart({
  history,
  platforms,
}: {
  history: CatalogProduct["price_history"];
  platforms: CatalogPlatform[];
}) {
  const names = Object.fromEntries(platforms.map((p) => [p.id, p.name]));
  const ids = Object.keys(history.series);
  const rows = history.weeks.map((week, i) => ({
    week,
    ...Object.fromEntries(ids.map((id) => [names[id] ?? id, history.series[id][i]])),
  }));
  const last = rows.length - 1;
  const weekLabel = (w: string) => `สัปดาห์ ${Number(w.split("-W")[1])}`;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={rows} margin={{ left: 0, right: 72, top: 8, bottom: 0 }}>
        <CartesianGrid stroke="#F1F4F8" vertical={false} />
        <XAxis
          dataKey="week"
          tickFormatter={weekLabel}
          tick={{ fontSize: 10, fill: "#5A667A" }}
          interval={1}
          axisLine={{ stroke: "#E3E8EF" }}
          tickLine={false}
        />
        <YAxis
          domain={["dataMin - 20", "dataMax + 20"]}
          tickFormatter={(v: number) => `฿${Math.round(v).toLocaleString("en-US")}`}
          tick={{ fontSize: 10, fill: "#5A667A" }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip labelFormatter={(w: string) => weekLabel(w)} formatter={(v: number) => `฿${v.toLocaleString("en-US")}`} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#33415A" }} iconType="square" />
        {ids.map((id) => {
          const name = names[id] ?? id;
          return (
            <Line
              key={id}
              type="monotone"
              dataKey={name}
              stroke={platformColor(name)}
              strokeWidth={2}
              dot={false}
              label={({ x, y, index }: { x: number; y: number; index: number }) =>
                index === last ? (
                  <text x={x + 8} y={y + 4} fontSize={11} fill="#33415A">
                    {name}
                  </text>
                ) : (
                  <g />
                )
              }
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
