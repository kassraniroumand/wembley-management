"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { YearlyEventStatsDTO } from "@/types"

// Default chart configuration for different event statuses
const defaultChartConfig = {
  total: {
    label: "Total Events",
    color: "hsl(var(--chart-1))",
  },
  tentative: {
    label: "Tentative",
    color: "hsl(var(--chart-2))",
  },
  confirmed: {
    label: "Confirmed",
    color: "hsl(var(--chart-3))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-4))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

// Helper function to get month name from number
const getMonthName = (monthNumber: number) => {
  const date = new Date(2024, monthNumber - 1, 1);
  return format(date, "MMMM");
}

export interface EventStatsChartProps {
  /**
   * The year to display statistics for.
   */
  year: number;
  /**
   * The event statistics data to display.
   */
  data: YearlyEventStatsDTO | null;
  /**
   * Whether the data is currently loading.
   */
  isLoading?: boolean;
  /**
   * Error message if data loading failed.
   */
  error?: string | null;
  /**
   * Custom chart configuration. If not provided, default configuration will be used.
   */
  chartConfig?: ChartConfig;
  /**
   * Custom title for the chart card.
   */
  title?: string;
  /**
   * Custom description for the chart card.
   */
  description?: string;
  /**
   * Whether to show the trend indicator in the footer.
   */
  showTrend?: boolean;
  /**
   * Height of the chart in pixels.
   */
  height?: number;
  /**
   * Whether to show the card wrapper. If false, only the chart will be rendered.
   */
  showCard?: boolean;
  /**
   * Custom CSS class for the card.
   */
  className?: string;
  /**
   * Whether to show all status lines or just the total.
   */
  showAllStatuses?: boolean;
}

export function EventStatsChart({
  year,
  data,
  isLoading = false,
  error = null,
  chartConfig = defaultChartConfig,
  title = "Event Statistics",
  description = "Monthly Event Distribution",
  showTrend = true,
  height = 300,
  showCard = true,
  className = "",
  showAllStatuses = true,
}: EventStatsChartProps) {
  // Transform monthly stats for the chart
  const chartData = data?.monthlyStats.map(stat => ({
    month: getMonthName(stat.month),
    total: stat.count,
    tentative: stat.tentativeCount,
    confirmed: stat.confirmedCount,
    cancelled: stat.cancelledCount,
    completed: stat.completedCount,
  })) || [];

  // Calculate trend (simple comparison of last month vs previous month)
  const lastMonth = chartData[chartData.length - 1]?.total || 0;
  const previousMonth = chartData[chartData.length - 2]?.total || 0;
  const trendPercentage = previousMonth > 0
    ? ((lastMonth - previousMonth) / previousMonth) * 100
    : 0;
  const isTrendUp = trendPercentage > 0;

  // Render the chart content
  const renderChartContent = () => {
    if (isLoading) {
      return <Skeleton className={`h-[${height}px] w-full`} />;
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-[${height}px] text-destructive">
          {error || "Failed to load event statistics"}
        </div>
      );
    }

    if (!data || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[${height}px] text-muted-foreground">
          No event statistics available for {year}
        </div>
      );
    }

    return (
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-md p-3 shadow-md">
                      <p className="font-medium">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                          {entry.name}: {entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={{ fill: "var(--color-total)" }}
              activeDot={{ r: 6 }}
            />
            {showAllStatuses && (
              <>
                <Line
                  type="monotone"
                  dataKey="confirmed"
                  stroke="var(--color-confirmed)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-confirmed)" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="tentative"
                  stroke="var(--color-tentative)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-tentative)" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="var(--color-cancelled)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-cancelled)" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="var(--color-completed)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-completed)" }}
                  activeDot={{ r: 6 }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  // If not showing card, just return the chart content
  if (!showCard) {
    return renderChartContent();
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{year} {description}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderChartContent()}
      </CardContent>
      {showTrend && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {isTrendUp ? "Trending up" : "Trending down"} by {Math.abs(trendPercentage).toFixed(1)}% this month
            <TrendingUp className={`h-4 w-4 ${isTrendUp ? "text-green-500" : "text-red-500"}`} />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing event distribution for {year}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
