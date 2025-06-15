import { RecentLossTable } from '@/components/recent-loss-table/recent-loss-table';
import payloadConfig from '@payload-config';
import { getPayload } from 'payload';
import { unstable_cache } from 'next/cache';

const getRecentLoss = unstable_cache(
  async () => {
    const config = await payloadConfig;
    const payload = await getPayload({ config });

    const data = await payload.find({
      collection: 'loss',
      limit: 10,
      depth: 1,
      overrideAccess: false,
      select: {
        machine: true,
        location: true,
        images: true,
        status: true,
      },
    });

    const formattedData = data.docs.map((doc) => ({
      id: doc.id,
      images: Array.isArray(doc.images)
        ? doc.images
            .map((img) => (typeof img === 'object' && 'url' in img ? img.url : null))
            .filter((url): url is string => typeof url === 'string')
        : [],
      type: typeof doc.machine === 'object' && doc.machine?.name ? doc.machine.name : '',
      location: typeof doc.location === 'object' && doc.location?.name ? doc.location.name : '',
      status: doc.status,
    }));

    return formattedData;
  },
  ['recent-loss'],
  {
    revalidate: 3600,
    tags: ['loss'],
  },
);

export async function RecentLoss() {
  const data = await getRecentLoss();

  return <RecentLossTable data={data} />;
}
