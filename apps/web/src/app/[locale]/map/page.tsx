import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getWarConflicts } from '@/lib/strapi';
import { MapPageClient } from '@/components/map/map-page-client';

export const metadata: Metadata = {
  title: 'Conflict Map',
};

export const dynamic = 'force-dynamic';

const DRAWER_COOKIE = 'map_drawer_open';

export default async function MapPage() {
  const cookieStore = await cookies();
  const drawerCookie = cookieStore.get(DRAWER_COOKIE)?.value;
  // Default open unless the user explicitly closed it
  const defaultDrawerOpen = drawerCookie !== 'false';

  const conflicts = await getWarConflicts();

  return (
    <div className="h-full overflow-hidden">
      <MapPageClient conflicts={conflicts} defaultDrawerOpen={defaultDrawerOpen} />
    </div>
  );
}
