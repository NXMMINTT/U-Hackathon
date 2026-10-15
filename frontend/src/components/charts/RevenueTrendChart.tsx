"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { Overview } from "@/hooks/useDashboard";
import { formatTHB, formatThaiDayMonth } from "@/lib/format";
import th from "@/locales/th.json";

export function RevenueTrendChart({ daily }: { daily: Overview["daily"] }) {
  const data = daily.map((p) => ({ date: p.date, income: Number(p.income), expense: Number(p.expense) }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid stroke="#F1F4F8" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatThaiDayMonth}
          tick={{ fontSize: 11, fill: "#5A667A" }}
          axisLine={{ stroke: "#E3E8EF" }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis hide />
        <Tooltip
          labelFormatter={(label: string) => formatThaiDayMonth(label)}
          formatter={(value: number) => formatTHB(value)}
        />
        <Legend wrapperStyle={{ fontSize: 13, color: "#33415A" }} iconType="square" />
        <Line
          type="monotone"
          dataKey="income"
          name={th.myBusiness.income}
          stroke="#1F5FBF"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="expense"
          name={th.myBusiness.expense}
          stroke="#E0A030"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
