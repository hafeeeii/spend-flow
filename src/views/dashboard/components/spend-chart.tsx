"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendMonthData } from "../types";

interface SpendChartProps {
  data: TrendMonthData[];
}

export function SpendChart({ data }: SpendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const trendSvgWidth = 500;
  const trendSvgHeight = 180;
  const trendPadding = 40;
  const trendChartWidth = trendSvgWidth - trendPadding * 2;
  const trendChartHeight = trendSvgHeight - trendPadding * 2;

  const maxTrendSpend = Math.max(...data.map((d) => d.spend));
  const trendPoints = data.map((d, index) => {
    const x = trendPadding + (index / (data.length - 1)) * trendChartWidth;
    const y =
      trendPadding +
      trendChartHeight -
      (d.spend / maxTrendSpend) * trendChartHeight;
    return { x, y, ...d };
  });

  const trendLinePath = trendPoints.reduce((acc, p, i) => {
    return acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
  }, "");

  const trendAreaPath =
    trendPoints.length > 0
      ? `${trendLinePath} L ${trendPoints[trendPoints.length - 1].x} ${trendPadding + trendChartHeight} L ${trendPoints[0].x} ${trendPadding + trendChartHeight} Z`
      : "";

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
      <CardContent className="relative h-56 pt-2">
        <svg
          viewBox={`0 0 ${trendSvgWidth} ${trendSvgHeight}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
            const y = trendPadding + r * trendChartHeight;
            const val = Math.round(maxTrendSpend * (1 - r));
            return (
              <g key={i}>
                <line
                  x1={trendPadding}
                  y1={y}
                  x2={trendSvgWidth - trendPadding}
                  y2={y}
                  strokeWidth="1"
                  className="stroke-border/40"
                />
                <text
                  x={trendPadding - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[8px] fill-current text-muted-foreground/80 font-semibold"
                >
                  ${(val / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path
            d={trendAreaPath}
            fill="url(#spendGrad)"
            className="transition-all duration-300"
          />

          {/* Connection Line */}
          <path
            d={trendLinePath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Data points & Interaction triggers */}
          {trendPoints.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 6 : 4}
                stroke="var(--primary)"
                strokeWidth={hoveredIndex === i ? 2 : 1.5}
                className={`transition-all duration-150 cursor-pointer ${
                  hoveredIndex === i ? "fill-primary" : "fill-card"
                }`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <text
                x={p.x}
                y={trendSvgHeight - trendPadding + 14}
                textAnchor="middle"
                className="text-[9px] fill-current text-muted-foreground font-bold"
              >
                {p.month}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip display */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-10 p-2 bg-popover text-popover-foreground border border-border rounded-lg text-xs shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-150"
            style={{
              left: `${(trendPoints[hoveredIndex].x / trendSvgWidth) * 100}%`,
              top: `${(trendPoints[hoveredIndex].y / trendSvgHeight) * 100 - 8}%`,
            }}
          >
            <div className="font-bold">{data[hoveredIndex].month} Spend</div>
            <div className="text-primary font-extrabold mt-0.5">
              $
              {data[hoveredIndex].spend.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
