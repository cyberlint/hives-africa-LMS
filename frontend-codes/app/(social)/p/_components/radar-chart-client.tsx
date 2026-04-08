"use client"

import { useTheme } from "next-themes"
import { useMemo } from "react"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts"

interface RadarChartClientProps {
  data: { dimension: string; score: number; fullMark: number }[]
}

export function RadarChartClient({ data }: RadarChartClientProps) {
  const { theme } = useTheme()

  // 🎯 Resolve colors based on theme
  const colors = useMemo(() => {
    const isDark = theme === "dark"

    return {
      grid: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
      text: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
      tooltipBg: isDark ? "#0f172a" : "#ffffff", // slate-900 vs white
      tooltipBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      accent: "#f97316", // your orange-500
      accentFill: isDark
        ? "rgba(249,115,22,0.35)"
        : "rgba(249,115,22,0.2)"
    }
  }, [theme])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        
        {/* GRID */}
        <PolarGrid
          stroke={colors.grid}
          strokeDasharray="3 3"
        />

        {/* AXIS LABELS */}
        <PolarAngleAxis
          dataKey="dimension"
          tick={{
            fill: colors.text,
            fontSize: 11,
            fontWeight: 500
          }}
        />

        {/* SCALE */}
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />

        {/* TOOLTIP */}
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Score"]}
          contentStyle={{
            backgroundColor: colors.tooltipBg,
            borderRadius: "10px",
            border: `1px solid ${colors.tooltipBorder}`,
            fontSize: "12px"
          }}
          labelStyle={{
            color: colors.text
          }}
        />

        {/* DATA */}
        <Radar
          name="Competence"
          dataKey="score"
          stroke={colors.accent}
          strokeWidth={2}
          fill={colors.accentFill}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}