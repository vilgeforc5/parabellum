'use client';

import { Globe, Layers, MapPin, Swords, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MapData, WarConflict } from '@/lib/strapi';

const STATUS_COLORS: Record<string, string> = {
  destroyed: 'bg-red-500',
  damaged: 'bg-orange-500',
  captured: 'bg-blue-500',
  abandoned: 'bg-purple-500',
};

type FilterSet = {
  equipmentTypes: Set<string>;
  countries: Set<string>;
  statuses: Set<string>;
};

type MapSidebarContentProps = {
  conflicts: WarConflict[];
  selectedConflictSlug: string;
  mapData: MapData | null;
  isLoading: boolean;
  showEquipment: boolean;
  showEvents: boolean;
  filters: FilterSet;
  onConflictChange: (slug: string) => void;
  onToggleEquipment: () => void;
  onToggleEvents: () => void;
  onToggleEquipmentType: (slug: string) => void;
  onToggleCountry: (slug: string) => void;
  onToggleStatus: (slug: string) => void;
};

export function MapSidebarContent({
  conflicts,
  selectedConflictSlug,
  mapData,
  isLoading,
  showEquipment,
  showEvents,
  filters,
  onConflictChange,
  onToggleEquipment,
  onToggleEvents,
  onToggleEquipmentType,
  onToggleCountry,
  onToggleStatus,
}: MapSidebarContentProps) {
  return (
    <div className="flex min-h-full flex-col gap-0">
      {/* Header */}
      <div className="px-4 pt-5 pb-4">
        <h2 className="text-base font-semibold">Map Filters</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Select a conflict and apply filters
        </p>
      </div>

      <Separator />

      {/* Conflict selector */}
      <div className="px-4 py-4">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Swords className="h-3.5 w-3.5" />
          Conflict
        </p>
        <Select value={selectedConflictSlug} onValueChange={onConflictChange}>
          <SelectTrigger className="w-full border-border/70 bg-card/60 text-sm">
            <SelectValue placeholder="Select conflict…" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {conflicts.map((c) => (
              <SelectItem key={c.documentId} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Layers toggles */}
      <div className="px-4 py-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Layers className="h-3.5 w-3.5" />
          Layers
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onToggleEquipment}
            className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
              showEquipment
                ? 'border-chart-1/50 bg-chart-1/10 text-foreground'
                : 'border-border/50 bg-card/40 text-muted-foreground hover:bg-card/80'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${showEquipment ? 'bg-chart-1' : 'bg-muted'}`}
            />
            Destroyed Equipment
            {mapData && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {mapData.equipment.length}
              </Badge>
            )}
          </button>

          <button
            onClick={onToggleEvents}
            className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
              showEvents
                ? 'border-chart-2/50 bg-chart-2/10 text-foreground'
                : 'border-border/50 bg-card/40 text-muted-foreground hover:bg-card/80'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${showEvents ? 'bg-chart-2' : 'bg-muted'}`}
            />
            Events
            {mapData && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {mapData.events.length}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Status filter */}
      {mapData && mapData.availableStatuses.length > 0 && (
        <>
          <Separator />
          <div className="px-4 py-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Tag className="h-3.5 w-3.5" />
              Status
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mapData.availableStatuses.map((s) => {
                const active = filters.statuses.has(s.slug);
                const colorClass = STATUS_COLORS[s.slug] ?? 'bg-muted-foreground';
                return (
                  <button
                    key={s.slug}
                    onClick={() => onToggleStatus(s.slug)}
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                      active
                        ? 'border-transparent text-white shadow-sm'
                        : 'border-border/60 bg-background/60 text-muted-foreground hover:border-border hover:text-foreground'
                    }`}
                    style={
                      active
                        ? {
                            backgroundColor:
                              s.slug === 'destroyed'
                                ? '#ef4444'
                                : s.slug === 'damaged'
                                  ? '#f97316'
                                  : s.slug === 'captured'
                                    ? '#3b82f6'
                                    : '#a855f7',
                          }
                        : undefined
                    }
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${active ? 'bg-white/70' : colorClass}`}
                    />
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Equipment type filter */}
      {mapData && mapData.availableEquipmentTypes.length > 0 && (
        <>
          <Separator />
          <div className="px-4 py-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Layers className="h-3.5 w-3.5" />
              Equipment Type
            </p>
            <div className="flex flex-col gap-1.5">
              {mapData.availableEquipmentTypes.map((t) => {
                const active = filters.equipmentTypes.has(t.slug);
                return (
                  <button
                    key={t.slug}
                    onClick={() => onToggleEquipmentType(t.slug)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? 'border-chart-1/40 bg-chart-1/10 text-foreground'
                        : 'border-border/50 bg-card/30 text-muted-foreground hover:bg-card/60 hover:text-foreground'
                    }`}
                  >
                    <span>{t.name}</span>
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-chart-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Country filter */}
      {mapData && mapData.availableCountries.length > 0 && (
        <>
          <Separator />
          <div className="px-4 py-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              Country
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mapData.availableCountries.map((c) => {
                const active = filters.countries.has(c.slug);
                return (
                  <button
                    key={c.slug}
                    onClick={() => onToggleCountry(c.slug)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                      active
                        ? 'border-chart-3/50 bg-chart-3/15 text-foreground'
                        : 'border-border/60 bg-background/60 text-muted-foreground hover:border-border hover:text-foreground'
                    }`}
                  >
                    {c.code && (
                      <span className="mr-1 opacity-70">{c.code}</span>
                    )}
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Events legend */}
      {showEvents && mapData && mapData.events.length > 0 && (
        <>
          <Separator />
          <div className="px-4 py-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Event Legend
            </p>
            <div className="grid grid-cols-2 gap-1">
              {[
                { key: 'battle', label: 'Battle', color: '#ef4444', icon: '⚔️' },
                { key: 'airstrike', label: 'Airstrike', color: '#f97316', icon: '✈️' },
                { key: 'naval', label: 'Naval', color: '#3b82f6', icon: '🚢' },
                { key: 'artillery', label: 'Artillery', color: '#eab308', icon: '💥' },
                { key: 'ground', label: 'Ground', color: '#22c55e', icon: '🪖' },
                { key: 'evacuation', label: 'Evacuation', color: '#a855f7', icon: '🏥' },
              ].map((cat) => (
                <div
                  key={cat.key}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full"
                    style={{ backgroundColor: cat.color + '30', color: cat.color }}
                  >
                    {cat.icon}
                  </span>
                  {cat.label}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {isLoading && (
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-chart-1" />
        </div>
      )}
    </div>
  );
}
