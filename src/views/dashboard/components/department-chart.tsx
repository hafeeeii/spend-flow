"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, Cell, YAxis, XAxis, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DepartmentBudget } from "../types";

interface DepartmentChartProps {
  data: DepartmentBudget[];
}

const chartConfig = {
  spent: {
    label: "Total Spent",
  },
} satisfies ChartConfig;

export function DepartmentChart({ data }: DepartmentChartProps) {
  return (
    <Card className="border-border shadow-2xs bg-card text-card-foreground transition-colors duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold text-foreground">
          Spend by Department
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">
          Current Q2 aggregate spend distribution.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-56 pt-2">
        <ChartContainer config={chartConfig} className="h-full w-full overflow-visible">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 45, left: -10, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="department"
              type="category"
              tickLine={false}
              axisLine={false}
              className="text-[10px] font-semibold fill-muted-foreground"
              width={75}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent labelKey="department" />} />
            <Bar dataKey="spent" radius={4} barSize={12}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "var(--primary)"} />
              ))}
              <LabelList
                dataKey="spent"
                position="right"
                formatter={(value: any) => {
                  const num = Number(value);
                  return isNaN(num) ? "" : `$${(num / 1000).toFixed(1)}k`;
                }}
                className="text-[9px] font-bold fill-muted-foreground"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

