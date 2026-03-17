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
import type { TimelineDataPoint } from '@parabellum/contracts';

interface TimelineChartProps {
  data: TimelineDataPoint[];
  title?: string;
}

export function TimelineChart({
  data,
  title = 'Losses Over Time',
}: TimelineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="date"
                stroke="#a1a1aa"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '0.5rem',
                  color: '#fafafa',
                }}
              />
              <Area
                type="monotone"
                dataKey="destroyed"
                stackId="1"
                stroke="#e11d48"
                fill="#e11d48"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="damaged"
                stackId="1"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="captured"
                stackId="1"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="abandoned"
                stackId="1"
                stroke="#71717a"
                fill="#71717a"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
