'use client';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

interface EverydayLossGraphProps {
  data: Array<{ month: string; value: number }>;
  trend: number;
}

export function LossCountGraph({ data, trend }: EverydayLossGraphProps) {
  const isTrendingUp = trend > 0;
  const trendValue = Math.abs(trend);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Ежедневные потери</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: 'Кол-во',
              color: 'var(--primary)',
            },
          }}
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {trend && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div
            className={cn(
              'flex gap-2 leading-none justify-center',
              isTrendingUp ? 'text-green-500' : 'text-red-500',
            )}
          >
            {isTrendingUp ? (
              <TrendingUp className="h-4 w-4 " />
            ) : (
              <TrendingDown className="h-4 w-4 color-red-500" />
            )}
            <span>Изменились на {trendValue}%</span>
          </div>
          <div className="text-muted-foreground leading-none">
            По сравнению с предыдущим периодом
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
