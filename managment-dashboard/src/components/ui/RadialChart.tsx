import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from 'lucide-react';

interface RadialChartProps {
  title: string;
  subtitle?: string;
  data: {
    key: string;
    value: number | undefined;
    fill: string;
  };
  config: Record<string, { label: string; color?: string }>;
  trendValue?: number;
  footerNote?: string;
}

export function RadialBarChart({
  title,
  subtitle,
  data,
  config,
  trendValue,
  footerNote
}: RadialChartProps) {
  const isTrendingUp = trendValue && trendValue > 0;
  const value = data.value || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent className="flex items-center justify-center pb-2">
        <div className="relative h-36 w-36">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            {/* Value circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={data.fill}
              strokeWidth="8"
              strokeDasharray={`${Math.min(value, 100) * 2.51} 251`}
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <text
              x="50"
              y="45"
              textAnchor="middle"
              className="fill-foreground text-lg font-bold"
            >
              {value.toLocaleString()}
            </text>
            <text
              x="50"
              y="60"
              textAnchor="middle"
              className="fill-muted-foreground text-xs"
            >
              {config[data.key]?.label || data.key}
            </text>
          </svg>
        </div>
      </CardContent>
      {(trendValue || footerNote) && (
        <CardFooter className="flex-col gap-2 text-sm">
          {trendValue && (
            <div className="flex items-center gap-2 font-medium leading-none">
              {isTrendingUp ? 'Trending up by' : 'Trending down by'} {Math.abs(trendValue)}% this month {' '}
              {isTrendingUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          )}
          {footerNote && (
            <div className="leading-none text-muted-foreground">
              {footerNote}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
