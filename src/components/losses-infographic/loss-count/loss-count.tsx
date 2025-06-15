import React from 'react';
import { LossCountGraph } from '@/components/losses-infographic/loss-count/loss-count-graph';
import { unstable_cache } from 'next/cache';
import payloadConfig from '@payload-config';
import { getPayload } from 'payload';
import { getTimePeriod } from '@/components/losses-infographic/getTimePeriod';

const getData = unstable_cache(
  async () => {
    const config = await payloadConfig;
    const payload = await getPayload({ config });
    const days = 10;
    const { ago, now } = getTimePeriod(days);
    const { ago: longAgo } = getTimePeriod(days * 2);

    const { totalDocs: agoDocsCount } = await payload.count({
      collection: 'loss',
      where: {
        createdAt: {
          less_than_equal: ago.toISOString(),
          greater_than_equal: longAgo.toISOString(),
        },
      },
    });

    const { docs: loss } = await payload.find({
      collection: 'loss',
      where: {
        createdAt: {
          greater_than_equal: ago.toISOString(),
        },
      },
      select: {
        createdAt: true,
      },
    });

    const dateGrouped = new Map<string, number>();
    loss.forEach((doc) => {
      const key = new Date(doc.createdAt).toLocaleDateString();

      if (dateGrouped.has(key)) {
        dateGrouped.set(key, dateGrouped.get(key)! + 1);
      } else {
        dateGrouped.set(key, 1);
      }
    });

    const data: Array<{ month: string; value: number }> = [];

    for (let i = days; i >= 0; i--) {
      const { ago: daysAgo } = getTimePeriod(i);

      const key = daysAgo.toLocaleDateString();

      data.push({ month: key, value: dateGrouped.get(key) || 0 });
    }

    return {
      data,
      trend: 100 * (1 - agoDocsCount / loss.length),
    };
  },
  ['loss-count'],
  { revalidate: 3600 },
);

export async function LossCount() {
  const data = await getData();

  return <LossCountGraph data={data.data} trend={data.trend} />;
}
