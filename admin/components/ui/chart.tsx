"use client"

import type * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Chart({ children, className, ...props }: ChartProps) {
  return (
    <div className={cn("chart-container", className)} {...props}>
      {children}
    </div>
  )
}

interface ChartTooltipProps extends React.ComponentProps<typeof Tooltip> {
  className?: string
  active?: boolean
  payload?: Array<{
    value: number
    name: string
    payload: {
      [key: string]: any
    }
  }>
  label?: string
  formatter?: (value: number, name: string, props: any) => [string | number, string]
  labelFormatter?: (label: string) => string
  itemStyle?: React.CSSProperties
  wrapperStyle?: React.CSSProperties
  contentStyle?: React.CSSProperties
  children?: React.ReactNode
}

export function ChartTooltip({
  className,
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  itemStyle,
  wrapperStyle,
  contentStyle,
  children,
  ...props
}: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      className={cn("chart-tooltip", className)}
      style={{
        ...wrapperStyle,
      }}
      {...props}
    >
      {children ? (
        children
      ) : (
        <div
          style={{
            ...contentStyle,
          }}
        >
          <div className="mb-2 font-medium">{labelFormatter ? labelFormatter(label as string) : label}</div>
          <div className="flex flex-col gap-1">
            {payload.map((item, index) => {
              const formattedValue = formatter ? formatter(item.value, item.name, item) : [item.value, item.name]
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: item.payload.fill || item.payload.color,
                      ...itemStyle,
                    }}
                  />
                  <div className="text-sm text-muted-foreground">{formattedValue[1]}</div>
                  <div className="ml-auto text-sm font-medium">{formattedValue[0]}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
}
