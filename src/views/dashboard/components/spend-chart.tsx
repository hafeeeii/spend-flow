"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { TrendMonthData } from "../types";

interface SpendChartProps {
  data: TrendMonthData[];
}

const chartConfig = {
  spend: {
    label: "Monthly Spend",
    color: "#635bff",
  },
} satisfies ChartConfig;

export function SpendChart({ data }: SpendChartProps) {
  return (
    <Card className="lg:col-span-2 border-border shadow-2xs bg-card text-card-foreground transition-colors duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-sm font-bold text-foreground">
            Monthly Spend Trends
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Aggregate spend over the last six months.
          </CardDescription>
        </div>
        <Badge
          variant="outline"
          className="text-xs font-semibold text-muted-foreground bg-background border-border"
        >
          H1 2026
        </Badge>
      </CardHeader>
      <CardContent className="h-44 pt-2">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorSpend)"
              dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
export default SpendChart;

