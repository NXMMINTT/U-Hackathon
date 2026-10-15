"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { MarketTrend } from "@/hooks/useMarket";
import { FALLBACK_COLOR, PLATFORM_COLORS } from "@/lib/market";
import th from "@/locales/th.json";

const t = th.marketRadar.overview;

/** "2026-W37" → "สัปดาห์ 37" */
const weekLabel = (week: string) => `สัปดาห์ ${Number(week.split("-W")[1])}`;

/** Omni-channel weekly units sold, one line per platform (spec 2.2). */
export function PlatformTrendChart({ data }: { data: MarketTrend }) {
  const weeks = data.series[0]?.points.map((p) => p.week) ?? [];
  const rows = weeks.map((week) => ({
    week,
    ...Object.fromEntries(data.series.map((s) => [s.platform, s.points.find((p) => p.week === week)?.units_sold ?? null])),
  }));
  const lastIndex = rows.length - 1;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={rows} margin={{ left: 0, right: 84, top: 8, bottom: 0 }}>
        <CartesianGrid stroke="#F1F4F8" vertical={false} />
        <XAxis
          dataKey="week"
          tickFormatter={weekLabel}
          tick={{ fontSize: 11, fill: "#5A667A" }}
          axisLine={{ stroke: "#E3E8EF" }}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 11, fill: "#5A667A" }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          labelFormatter={(label: string) => weekLabel(label)}
          formatter={(value: number) => `${value.toLocaleString("en-US")} ${t.unitsSold}`}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#33415A" }} iconType="square" />
        {data.series.map((s) => (
          <Line
            key={s.platform}
            type="monotone"
            dataKey={s.platform}
            stroke={PLATFORM_COLORS[s.platform] ?? FALLBACK_COLOR}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF" }}
            label={({ x, y, index }: { x: number; y: number; index: number }) =>
              index === lastIndex ? (
                <text x={x + 8} y={y + 4} fontSize={11} fill="#33415A">
                  {s.platform}
                </text>
              ) : (
                <g />
              )
            }
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
