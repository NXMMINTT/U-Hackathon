"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type RevenueTrendPoint = { date: string; revenue: number };

/** Renders whatever points it's given — caller is responsible for labeling
 * sample vs. real data (see page.tsx `sampleDataNotice`). */
export function RevenueTrendChart({ data }: { data: RevenueTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data}>
        <XAxis dataKey="date" hide />
        <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
        <Tooltip formatter={(value: number) => value.toLocaleString("en-US")} />
        <Line type="monotone" dataKey="revenue" stroke="#1DB446" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
