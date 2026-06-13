"use client"

import React from "react"
import { BarChart, Bar, Cell, YAxis, XAxis, LabelList } from "recharts"
import { useBudgets } from "@/hooks/use-budgets"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  spent: {
    label: "Total Spent",
  },
} satisfies ChartConfig

export function DepartmentSpendChart() {
  const { budgets, isMounted } = useBudgets()

  const depts = ["Engineering", "Marketing", "Sales", "Operations", "Design"]
  
  const values = depts.map(d => {
    const items = budgets.filter(b => b.department === d)
    const spent = items.reduce((acc, curr) => acc + curr.spent, 0)
    return { label: d, spent }
  })

  const getBarColor = (label: string) => {
    if (label === "Engineering") return "#475569" // slate-600
    if (label === "Marketing") return "#ec4899" // pink-500
    if (label === "Sales") return "#f59e0b" // amber-500
    if (label === "Operations") return "#14b8a6" // teal-500
    if (label === "Design") return "#635bff" // indigo-500
    return "#635bff"
  }

  if (!isMounted) {
    return (
      <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground animate-pulse">
        Calculating department spend...
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full min-h-[160px] max-h-[170px] overflow-visible">
      <BarChart
        data={values}
        layout="vertical"
        margin={{ top: 5, right: 45, left: 15, bottom: 5 }}
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="label"
          type="category"
          tickLine={false}
          axisLine={false}
          className="text-[10px] font-semibold fill-slate-600 dark:fill-slate-450"
          width={70}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent labelKey="label" />} />
        <Bar dataKey="spent" radius={4} barSize={14}>
          {values.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.label)} />
          ))}
          <LabelList
            dataKey="spent"
            position="right"
            formatter={(value: any) => {
              const num = Number(value)
              return isNaN(num) ? "" : `$${(num / 1000).toFixed(1)}k`
            }}
            className="text-[9px] font-bold fill-muted-foreground"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
export default DepartmentSpendChart
