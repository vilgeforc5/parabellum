import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';
import payloadConfig from '@payload-config';
import React from 'react';
import { TechCard } from './tech-card';
import { getTimePeriod } from '@/components/losses-infographic/getTimePeriod';

export interface TechCard {
  name: string;
  icon: string;
  damaged: number;
  destroyed: number;
  trophy: number;
  total: number;
}

export const getCards = unstable_cache(
  async (): Promise<TechCard[]> => {
    const payload = await getPayload({ config: await payloadConfig });

    const { docs: categories } = await payload.find({
      collection: 'machineCategory',
      depth: 1,
      limit: 100,
    });

    const cards: TechCard[] = [];

    for (const category of categories) {
      const { id, name, icon } = category;

      const { docs: machines } = await payload.find({
        collection: 'machine',
        where: {
          category: {
            equals: id,
          },
        },
        limit: 1000,
        overrideAccess: false,
      });

      const machineIds = machines.map((m) => m.id);
      if (machineIds.length === 0) {
        cards.push({
          name,
          icon: typeof icon === 'object' && icon?.url ? icon.url : '',
          damaged: 0,
          destroyed: 0,
          trophy: 0,
          total: 0,
        });
        continue;
      }

      const getCountByStatus = async (status: string) => {
        const res = await payload.count({
          collection: 'loss',
          where: {
            and: [
              {
                machine: {
                  in: machineIds,
                },
              },
              {
                createdAt: {
                  greater_than_equal: getTimePeriod().ago.toISOString(),
                },
              },
              {
                status: {
                  equals: status,
                },
              },
            ],
          },
        });

        return res.totalDocs;
      };

      const counts = {
        damaged: await getCountByStatus('damaged'),
        destroyed: await getCountByStatus('destroyed'),
        trophy: await getCountByStatus('trophy'),
      };

      cards.push({
        name,
        icon: typeof icon === 'object' && icon?.url ? icon.url : '',
        ...counts,
        total: counts.destroyed + counts.damaged + counts.trophy,
      });
    }

    return cards;
  },
  ['machineCategory'],
  { revalidate: 3600 },
);

export async function TechCards() {
  const cards = await getCards();

  return (
    <div className="mt-8 col-span-full">
      <h2 className="text-2xl font-bold mb-4">Важное</h2>
      <div className="flex flex-wrap gap-8">
        {cards.map((item) => (
          <TechCard {...item} key={item.name} />
        ))}
      </div>
    </div>
  );
}
