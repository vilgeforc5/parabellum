import { NextRequest, NextResponse } from 'next/server';
import { getMapData } from '@/lib/strapi';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const conflictSlug = searchParams.get('conflictSlug');

  if (!conflictSlug) {
    return NextResponse.json(
      { error: 'conflictSlug is required' },
      { status: 400 },
    );
  }

  const equipmentTypeSlugs =
    searchParams.get('equipmentTypes')?.split(',').filter(Boolean) ?? [];
  const countrySlugs =
    searchParams.get('countries')?.split(',').filter(Boolean) ?? [];
  const statusSlugs =
    searchParams.get('statuses')?.split(',').filter(Boolean) ?? [];

  try {
    const data = await getMapData({
      conflictSlug,
      equipmentTypeSlugs: equipmentTypeSlugs.length
        ? equipmentTypeSlugs
        : undefined,
      countrySlugs: countrySlugs.length ? countrySlugs : undefined,
      statusSlugs: statusSlugs.length ? statusSlugs : undefined,
    });

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[map/route]', error);
    return NextResponse.json(
      { error: 'Failed to fetch map data' },
      { status: 500 },
    );
  }
}
