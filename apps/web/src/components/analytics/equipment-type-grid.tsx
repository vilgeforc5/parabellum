'use client';

import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { AnalyticsEquipmentTile } from '@/lib/strapi';

interface EquipmentTypeGridProps {
  tiles: AnalyticsEquipmentTile[];
  selectedTypeSlug: string | null;
  lostLabel?: string;
  damagedLabel?: string;
}

export function EquipmentTypeGrid({
  tiles,
  selectedTypeSlug,
  lostLabel = 'lost',
  damagedLabel = 'damaged',
}: EquipmentTypeGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleTileClick(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('type') === slug) {
      params.delete('type');
    } else {
      params.set('type', slug);
      params.delete('page');
    }
    startTransition(() => {
      router.replace(
        params.size > 0 ? `${pathname}?${params.toString()}` : pathname,
        { scroll: false },
      );
    });
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
        isPending && 'opacity-60 pointer-events-none',
      )}
    >
      {tiles.map((tile) => {
        const isActive = tile.slug === selectedTypeSlug;
        return (
          <button
            key={tile.slug}
            type="button"
            onClick={() => handleTileClick(tile.slug)}
            className={cn(
              'flex flex-col items-start gap-2 sm:gap-3 rounded-xl border p-3 sm:p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm',
              isActive
                ? 'border-primary/50 bg-primary/5 shadow-sm shadow-primary/10'
                : 'border-border/60 bg-card/60',
            )}
          >
            <div className="relative h-12 sm:h-16 w-full overflow-hidden rounded-lg bg-muted/30 flex items-center justify-center">
              {tile.previewSvgUrl ? (
                <img
                  src={tile.previewSvgUrl}
                  alt=""
                  aria-hidden="true"
                  className="max-h-12 max-w-[80%] object-contain opacity-70"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-muted/50" />
              )}
            </div>
            <div className="w-full min-w-0">
              <p
                className={cn(
                  'text-sm font-medium leading-snug truncate',
                  isActive ? 'text-primary' : 'text-foreground',
                )}
              >
                {tile.name}
              </p>
              <p className="mt-0.5 sm:mt-1 text-sm sm:text-base font-bold tabular-nums">
                {tile.count.toLocaleString()}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  {lostLabel}
                </span>
              </p>
              {tile.byStatus.damaged > 0 && (
                <p className="text-xs text-muted-foreground tabular-nums">
                  {tile.byStatus.damaged.toLocaleString()} {damagedLabel}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
