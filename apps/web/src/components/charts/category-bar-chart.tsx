'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CHART_STATUS_COLORS, useChartTheme } from '@/lib/chart-theme';
import type { CategoryBreakdown } from '@parabellum/contracts';

interface CategoryBarChartProps {
  data: CategoryBreakdown[];
  title?: string;
}

export function CategoryBarChart({
  data,
  title = 'Losses by Equipment Category',
}: CategoryBarChartProps) {
  const { grid, axis, tooltipStyle } = useChartTheme();

  const chartData = data.map((d) => ({
    name: d.category.name,
    destroyed: d.byStatus.destroyed,
    damaged: d.byStatus.damaged,
    captured: d.byStatus.captured,
    abandoned: d.byStatus.abandoned,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis type="number" stroke={axis} fontSize={12} />
              <YAxis
                dataKey="name"
                type="category"
                stroke={axis}
                fontSize={12}
                width={100}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="destroyed"
                stackId="a"
                fill={CHART_STATUS_COLORS.destroyed}
              />
              <Bar
                dataKey="damaged"
                stackId="a"
                fill={CHART_STATUS_COLORS.damaged}
              />
              <Bar
                dataKey="captured"
                stackId="a"
                fill={CHART_STATUS_COLORS.captured}
              />
              <Bar
                dataKey="abandoned"
                stackId="a"
                fill={CHART_STATUS_COLORS.abandoned}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
