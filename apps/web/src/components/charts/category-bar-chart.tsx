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
import type { CategoryBreakdown } from '@parabellum/contracts';

interface CategoryBarChartProps {
  data: CategoryBreakdown[];
  title?: string;
}

export function CategoryBarChart({
  data,
  title = 'Losses by Equipment Category',
}: CategoryBarChartProps) {
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
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" stroke="#a1a1aa" fontSize={12} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#a1a1aa"
                fontSize={12}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '0.5rem',
                  color: '#fafafa',
                }}
              />
              <Bar dataKey="destroyed" stackId="a" fill="#e11d48" />
              <Bar dataKey="damaged" stackId="a" fill="#f97316" />
              <Bar dataKey="captured" stackId="a" fill="#2563eb" />
              <Bar dataKey="abandoned" stackId="a" fill="#71717a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
