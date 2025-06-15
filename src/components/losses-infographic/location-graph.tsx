'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as React from 'react';
import { Pie, PieChart } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ILocationGraphProps {
  data: Array<{ region: string; value: number; label: string }>;
}

export function LocationGraph({ data }: ILocationGraphProps) {
  const dataFormatted = data.map((item, index) => ({ ...item, fill: `var(--chart-${index + 1})` }));
  const dataConfig = data.reduce(
    (acc, item) => ({
      ...acc,
      [item.region]: {
        label: item.label,
      },
    }),
    {},
  );

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl">Геолокация</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex">
        <ChartContainer config={dataConfig} className="max-w-full mx-auto min-h-80">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
            <Pie
              data={dataFormatted}
              dataKey="value"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="var(--foreground)"
                  >
                    {payload.value}
                  </text>
                );
              }}
              nameKey="region"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="region" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
