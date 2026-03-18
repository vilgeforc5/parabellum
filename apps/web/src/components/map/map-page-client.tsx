'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { MapData, WarConflict } from '@/lib/strapi';
import { MapSidebarContent } from './map-sidebar-content';

const LeafletMap = dynamic(
  () => import('./leaflet-map').then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950">
        <div className="space-y-2 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-chart-1" />
          <p className="text-sm text-muted-foreground">Loading map…</p>
        </div>
      </div>
    ),
  },
);

const DEFAULT_CONFLICT_SLUG = 'russo-ukrainian-war';

type FilterSet = {
  equipmentTypes: Set<string>;
  countries: Set<string>;
  statuses: Set<string>;
};

const DRAWER_COOKIE = 'map_drawer_open';

function setDrawerCookie(open: boolean) {
  document.cookie = `${DRAWER_COOKIE}=${open}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

type MapPageClientProps = {
  conflicts: WarConflict[];
  defaultDrawerOpen: boolean;
  initialConflictSlug?: string;
  initialCenter?: { lat: number; lng: number };
};

export function MapPageClient({
  conflicts,
  defaultDrawerOpen,
  initialConflictSlug,
  initialCenter,
}: MapPageClientProps) {
  const defaultSlug =
    (initialConflictSlug
      ? conflicts.find((c) => c.slug === initialConflictSlug)?.slug
      : undefined) ??
    conflicts.find((c) => c.slug === DEFAULT_CONFLICT_SLUG)?.slug ??
    conflicts[0]?.slug ??
    '';

  const [selectedConflictSlug, setSelectedConflictSlug] = useState(defaultSlug);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEquipment, setShowEquipment] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(defaultDrawerOpen);

  const toggleDrawer = useCallback((next: boolean) => {
    setDrawerOpen(next);
    setDrawerCookie(next);
  }, []);
  const [filters, setFilters] = useState<FilterSet>({
    equipmentTypes: new Set<string>(),
    countries: new Set<string>(),
    statuses: new Set<string>(),
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchMapData = useCallback(
    async (conflictSlug: string, activeFilters: FilterSet) => {
      if (!conflictSlug) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ conflictSlug });
        if (activeFilters.equipmentTypes.size)
          params.set('equipmentTypes', [...activeFilters.equipmentTypes].join(','));
        if (activeFilters.countries.size)
          params.set('countries', [...activeFilters.countries].join(','));
        if (activeFilters.statuses.size)
          params.set('statuses', [...activeFilters.statuses].join(','));

        const res = await fetch(`/api/map?${params}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch');
        setMapData(await res.json());
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error('[MapPageClient]', err);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const empty: FilterSet = {
      equipmentTypes: new Set(),
      countries: new Set(),
      statuses: new Set(),
    };
    setFilters(empty);
    fetchMapData(selectedConflictSlug, empty);
  }, [selectedConflictSlug, fetchMapData]);

  const handleToggleEquipmentType = useCallback(
    (slug: string) =>
      setFilters((prev) => {
        const next = new Set(prev.equipmentTypes);
        next.has(slug) ? next.delete(slug) : next.add(slug);
        const updated = { ...prev, equipmentTypes: next };
        fetchMapData(selectedConflictSlug, updated);
        return updated;
      }),
    [selectedConflictSlug, fetchMapData],
  );

  const handleToggleCountry = useCallback(
    (slug: string) =>
      setFilters((prev) => {
        const next = new Set(prev.countries);
        next.has(slug) ? next.delete(slug) : next.add(slug);
        const updated = { ...prev, countries: next };
        fetchMapData(selectedConflictSlug, updated);
        return updated;
      }),
    [selectedConflictSlug, fetchMapData],
  );

  const handleToggleStatus = useCallback(
    (slug: string) =>
      setFilters((prev) => {
        const next = new Set(prev.statuses);
        next.has(slug) ? next.delete(slug) : next.add(slug);
        const updated = { ...prev, statuses: next };
        fetchMapData(selectedConflictSlug, updated);
        return updated;
      }),
    [selectedConflictSlug, fetchMapData],
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map — always full width/height */}
      <LeafletMap
        equipment={mapData?.equipment ?? []}
        events={mapData?.events ?? []}
        showEquipment={showEquipment}
        showEvents={showEvents}
        {...(initialCenter
          ? { centerLat: initialCenter.lat, centerLng: initialCenter.lng, zoom: 12 }
          : {})}
      />

      {/* Open button — only shown when drawer is closed */}
      {!drawerOpen && (
        <div className="absolute left-4 top-4 z-[1000]">
          <Button onClick={() => toggleDrawer(true)} size="sm" className="gap-2 shadow-lg">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-[999] flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm">
            <div className="h-3 w-3 animate-spin rounded-full border border-border border-t-chart-1" />
            Loading data…
          </div>
        </div>
      )}

      {/* Drawer — overlays the map, no backdrop */}
      <Sheet open={drawerOpen} onOpenChange={toggleDrawer} modal={false}>
        <SheetContent
          side="left"
          className="top-16 z-[900] h-[calc(100dvh-4rem)] w-80 overflow-y-auto border-r border-border/60 bg-background/95 p-0 shadow-2xl [&>button]:hidden"
          style={{ backdropFilter: 'none' }}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="flex flex-row items-center justify-between border-b border-border/60 px-4 py-3">
            <SheetTitle className="text-sm">Map Filters</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => toggleDrawer(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <MapSidebarContent
            conflicts={conflicts}
            selectedConflictSlug={selectedConflictSlug}
            mapData={mapData}
            isLoading={isLoading}
            showEquipment={showEquipment}
            showEvents={showEvents}
            filters={filters}
            onConflictChange={setSelectedConflictSlug}
            onToggleEquipment={() => setShowEquipment((v) => !v)}
            onToggleEvents={() => setShowEvents((v) => !v)}
            onToggleEquipmentType={handleToggleEquipmentType}
            onToggleCountry={handleToggleCountry}
            onToggleStatus={handleToggleStatus}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
