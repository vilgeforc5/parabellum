'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChartTheme } from '@/lib/chart-theme';
import type { HomeTimelinePoint } from '@/lib/strapi';

interface CumulativeTimelineChartProps {
  data: HomeTimelinePoint[];
  title?: string;
}

export function CumulativeTimelineChart({
  data,
  title = 'Cumulative Losses',
}: CumulativeTimelineChartProps) {
  const { grid, axis, tooltipStyle } = useChartTheme();

  let running = 0;
  const chartData = data.map((point) => {
    running += point.count;
    return { date: point.date, total: running };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis
                dataKey="date"
                stroke={axis}
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke={axis}
                fontSize={12}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
                }
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [(value as number).toLocaleString(), 'Total']}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#e11d48"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
