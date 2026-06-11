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
    <Card className="lg:col-span-2 border-slate-100/80 shadow-2xs bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-sm font-bold text-slate-800">
            Monthly Spend Trends
          </CardTitle>
          <CardDescription className="text-[10px] text-slate-400 mt-0.5">
            Aggregate spend over the last six months.
          </CardDescription>
        </div>
        <Badge
          variant="outline"
          className="text-xs font-semibold text-slate-500 bg-white border-slate-200"
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
              <stop offset="0%" stopColor="#635bff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#635bff" stopOpacity="0" />
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
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={trendPadding - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[8px] fill-slate-400 font-semibold"
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
            stroke="#635bff"
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
                fill={hoveredIndex === i ? "#635bff" : "#ffffff"}
                stroke="#635bff"
                strokeWidth={hoveredIndex === i ? 2 : 1.5}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <text
                x={p.x}
                y={trendSvgHeight - trendPadding + 14}
                textAnchor="middle"
                className="text-[9px] fill-slate-500 font-bold"
              >
                {p.month}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip display */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-10 p-2 bg-slate-900 text-white rounded-lg text-[10px] shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-150"
            style={{
              left: `${(trendPoints[hoveredIndex].x / trendSvgWidth) * 100}%`,
              top: `${(trendPoints[hoveredIndex].y / trendSvgHeight) * 100 - 8}%`,
            }}
          >
            <div className="font-bold">{data[hoveredIndex].month} Spend</div>
            <div className="text-indigo-300 font-extrabold mt-0.5">
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
