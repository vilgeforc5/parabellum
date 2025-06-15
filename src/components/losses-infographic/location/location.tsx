import { LocationGraph } from '@/components/losses-infographic/location/location-graph';
import { ComponentProps } from 'react';
import { unstable_cache } from 'next/cache';
import { getTimePeriod } from '../getTimePeriod';
import payloadConfig from '@payload-config';
import { getPayload } from 'payload';

const locationData: ComponentProps<typeof LocationGraph> = {
  data: [
    {
      region: 'DPR',
      value: 250,
      label: 'ДНР',
    },
    {
      region: 'LPR',
      value: 500,
      label: 'ЛНР',
    },
    {
      region: 'KHR',
      value: 750,
      label: 'Херсонская область',
    },
    {
      region: 'ZAP',
      value: 250,
      label: 'Запорожская область',
    },
  ],
};

export const getLocationData = unstable_cache(
  async () => {
    const config = await payloadConfig;
    const payload = await getPayload({ config });

    const losses = await payload.find({
      overrideAccess: false,
      collection: 'loss',
      where: {
        createdAt: {
          greater_than_equal: getTimePeriod().ago.toISOString(),
        },
      },
      depth: 2,
      limit: 1000,
      select: {
        location: true,
      },
    });

    const regionMap = new Map<string, { value: number; label: string }>();
    for (const loss of losses.docs) {
      const location = loss.location;

      if (typeof location === 'object' && location?.region && typeof location.region === 'object') {
        const region = location.region;
        const key = region.name;
        const label = region.longname || region.name;

        if (regionMap.has(key)) {
          regionMap.get(key)!.value += 1;
        } else {
          regionMap.set(key, { value: 1, label });
        }
      } else {
        const region = 'uknown';
        const key = 'unknown';
        const label = 'Неизвестно';

        if (regionMap.has(key)) {
          regionMap.get(key)!.value += 1;
        } else {
          regionMap.set(key, { value: 1, label });
        }
      }
    }

    return Array.from(regionMap.entries()).map(([region, { value, label }]) => ({
      region,
      value,
      label,
    }));
  },
  ['location'],
  { revalidate: 3600 },
);

export async function Location() {
  const data = await getLocationData();

  return <LocationGraph data={data} />;
}
