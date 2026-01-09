"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { string } from "better-auth"

export const description = "An interactive area chart"

const dummyEnrollmentData = [
  { date: '01/01/2026', enrollments: 18 },
  { date: '01/02/2026', enrollments: 41 },
  { date: '01/03/2026', enrollments: 9 },
  { date: '01/04/2026', enrollments: 27 },
  { date: '01/05/2026', enrollments: 4 },
  { date: '01/06/2026', enrollments: 33 },
  { date: '01/07/2026', enrollments: 15 },
  { date: '01/08/2026', enrollments: 52 },
  { date: '01/09/2026', enrollments: 11 },
  { date: '01/10/2026', enrollments: 6 },
  { date: '01/11/2026', enrollments: 29 },
  { date: '01/12/2026', enrollments: 17 },
  { date: '01/13/2026', enrollments: 44 },
  { date: '01/14/2026', enrollments: 8 },
  { date: '01/15/2026', enrollments: 36 },
  { date: '01/16/2026', enrollments: 21 },
  { date: '01/17/2026', enrollments: 5 },
  { date: '01/18/2026', enrollments: 48 },
  { date: '01/19/2026', enrollments: 13 },
  { date: '01/20/2026', enrollments: 31 },
  { date: '01/21/2026', enrollments: 7 },
  { date: '01/22/2026', enrollments: 26 },
  { date: '01/23/2026', enrollments: 19 },
  { date: '01/24/2026', enrollments: 42 },
  { date: '01/25/2026', enrollments: 10 },
  { date: '01/26/2026', enrollments: 34 },
  { date: '01/27/2026', enrollments: 16 },
  { date: '01/28/2026', enrollments: 23 },
  { date: '01/29/2026', enrollments: 38 },
  { date: '01/30/2026', enrollments: 12 },
  { date: '01/31/2026', enrollments: 47 },
];
  

const chartConfig: ChartConfig = {
enrollments: {
  label: "Enrollments",
  color: "var(--chart-1)",
}
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  data: {date: string; enrollments: number}[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {

  const totalEnrollmentsNumber = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollments, 0),
    [data]
    );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Enrollment trends for the last 30 days: {totalEnrollmentsNumber}</span>
          <span className="@[540px]/card:hidden">Last 30 days: {totalEnrollmentsNumber}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6"></CardContent>
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        <BarChart
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" 
          tickLine={false} axisLine={false} 
          tickMargin={8} 
          interval={"preserveStartEnd"}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", 
              { 
                month: "short", 
                day: "numeric"
               });
              }} 
          />
          <ChartTooltip 
            content={<ChartTooltipContent className="w-[150px]" />}
            labelFormatter={
              (value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", 
              { 
                month: "short", 
                day: "numeric"
               });
              }
            }
          />
          <Bar dataKey="enrollments" fill="var(--color-enrollments)">

          </Bar>
          </BarChart>

      </ChartContainer>
      </Card>
  )
}
