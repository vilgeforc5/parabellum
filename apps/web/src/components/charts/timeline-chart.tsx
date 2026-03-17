'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CHART_STATUS_COLORS, useChartTheme } from '@/lib/chart-theme';
import type { TimelineDataPoint } from '@parabellum/contracts';

interface TimelineChartProps {
  data: TimelineDataPoint[];
  title?: string;
}

export function TimelineChart({
  data,
  title = 'Losses Over Time',
}: TimelineChartProps) {
  const { grid, axis, tooltipStyle } = useChartTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis
                dataKey="date"
                stroke={axis}
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke={axis} fontSize={12} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="destroyed"
                stackId="1"
                stroke={CHART_STATUS_COLORS.destroyed}
                fill={CHART_STATUS_COLORS.destroyed}
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="damaged"
                stackId="1"
                stroke={CHART_STATUS_COLORS.damaged}
                fill={CHART_STATUS_COLORS.damaged}
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="captured"
                stackId="1"
                stroke={CHART_STATUS_COLORS.captured}
                fill={CHART_STATUS_COLORS.captured}
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="abandoned"
                stackId="1"
                stroke={CHART_STATUS_COLORS.abandoned}
                fill={CHART_STATUS_COLORS.abandoned}
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
