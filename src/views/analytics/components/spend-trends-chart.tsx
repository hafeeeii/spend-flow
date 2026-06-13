"use client"

import React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", spend: 34000 },
  { month: "Feb", spend: 45000 },
  { month: "Mar", spend: 42000 },
  { month: "Apr", spend: 58000 },
  { month: "May", spend: 71000 },
  { month: "Jun", spend: 84322 }
]

const chartConfig = {
  spend: {
    label: "Monthly Spend",
    color: "#635bff",
  },
} satisfies ChartConfig

export function SpendTrendsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full min-h-[160px] max-h-[170px] overflow-visible">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-spend)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--color-spend)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.3} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-[10px] fill-muted-foreground"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-[10px] fill-muted-foreground"
          tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent labelKey="month" />} />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="var(--color-spend)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorSpend)"
          dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
export default SpendTrendsChart
