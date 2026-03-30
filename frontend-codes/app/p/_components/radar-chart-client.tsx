"use client"

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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="75%"
        data={data}
      >
        {/* GRID */}
        <PolarGrid
          stroke="hsl(var(--border))"
          strokeDasharray="2 2"
        />

        {/* AXIS LABELS */}
        <PolarAngleAxis
          dataKey="dimension"
          tick={{
            fill: "hsl(var(--muted-foreground))",
            fontSize: 11,
            fontWeight: 500
          }}
        />

        {/* SCALE (IMPORTANT FOR TRUST) */}
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
            backgroundColor: "hsl(var(--card))",
            borderRadius: "10px",
            border: "1px solid hsl(var(--border))",
            fontSize: "12px"
          }}
        />

        {/* DATA */}
        <Radar
          name="Competence"
          dataKey="score"
          stroke="hsl(var(--orange))"
          strokeWidth={2}
          fill="hsl(var(--orange))"
          fillOpacity={0.2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}