'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CHART_STATUS_COLORS, useChartTheme } from '@/lib/chart-theme';
import type { LossStatusKey } from '@/lib/strapi';

interface StatusDonutChartProps {
  data: Record<LossStatusKey, number>;
  title?: string;
}

const STATUS_LABELS: Record<LossStatusKey, string> = {
  destroyed: 'Destroyed',
  damaged: 'Damaged',
  captured: 'Captured',
  abandoned: 'Abandoned',
};

export function StatusDonutChart({
  data,
  title = 'Loss Status Distribution',
}: StatusDonutChartProps) {
  const { tooltipStyle } = useChartTheme();

  const chartData = (Object.keys(data) as LossStatusKey[])
    .filter((key) => data[key] > 0)
    .map((key) => ({
      name: STATUS_LABELS[key],
      value: data[key],
      color: CHART_STATUS_COLORS[key],
    }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  const v = value as number;
                  return [`${v.toLocaleString()} (${total > 0 ? Math.round((v / total) * 100) : 0}%)`, name as string];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
