import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getWarConflicts } from '@/lib/strapi';
import { MapPageClient } from '@/components/map/map-page-client';

export const metadata: Metadata = {
  title: 'Conflict Map',
};

export const dynamic = 'force-dynamic';

const DRAWER_COOKIE = 'map_drawer_open';

export default async function MapPage({
  searchParams,
}: {
  searchParams?: Promise<{
    conflict?: string | string[];
    lat?: string | string[];
    lng?: string | string[];
  }>;
}) {
  const cookieStore = await cookies();
  const drawerCookie = cookieStore.get(DRAWER_COOKIE)?.value;
  const defaultDrawerOpen = drawerCookie !== 'false';

  const params = await searchParams;
  const conflictParam = Array.isArray(params?.conflict)
    ? params.conflict[0]
    : params?.conflict;
  const latParam = Array.isArray(params?.lat) ? params.lat[0] : params?.lat;
  const lngParam = Array.isArray(params?.lng) ? params.lng[0] : params?.lng;

  const lat = latParam ? Number.parseFloat(latParam) : undefined;
  const lng = lngParam ? Number.parseFloat(lngParam) : undefined;

  const conflicts = await getWarConflicts();

  return (
    <div className="h-full overflow-hidden">
      <MapPageClient
        conflicts={conflicts}
        defaultDrawerOpen={defaultDrawerOpen}
        initialConflictSlug={conflictParam}
        initialCenter={
          lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)
            ? { lat, lng }
            : undefined
        }
      />
    </div>
  );
}
