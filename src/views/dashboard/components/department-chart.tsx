"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DepartmentBudget } from "../types"

interface DepartmentChartProps {
  data: DepartmentBudget[];
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Card className="border-slate-100/80 shadow-2xs bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold text-slate-800">
          Spend by Department
        </CardTitle>
        <CardDescription className="text-[10px] text-slate-400 mt-0.5">
          Current Q2 aggregate spend distribution.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-56 pt-2">
        <div className="h-full flex flex-col justify-between space-y-3">
          {data.map((dept, i) => {
            const ratio = Math.min((dept.spent / dept.limit) * 100, 100);
            const isHovered = hoveredIndex === i;
            return (
              <div
                key={dept.department}
                className="space-y-1 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                  <span>{dept.department}</span>
                  <span className="font-semibold text-slate-400">
                    ${(dept.spent / 1000).toFixed(1)}k / $
                    {(dept.limit / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${ratio}%`,
                      backgroundColor: dept.color,
                      filter: isHovered ? "brightness(0.9)" : "none",
                    }}
                  />
                </div>

                {/* Responsive metric details */}
                {isHovered && (
                  <div className="flex items-center justify-between text-[9px] text-indigo-600 font-bold bg-indigo-50/50 p-1 rounded animate-fade-in">
                    <span>Allocated Ratio:</span>
                    <span>{Math.round(ratio)}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
