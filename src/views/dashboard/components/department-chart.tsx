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
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>{dept.department}</span>
                  <span className="font-semibold text-muted-foreground">
                    ${(dept.spent / 1000).toFixed(1)}k / $
                    {(dept.limit / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="relative w-full h-2 rounded-full bg-muted overflow-hidden">
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
                  <div className="flex items-center justify-between text-xs text-accent-foreground font-bold bg-accent p-1 rounded animate-fade-in">
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
