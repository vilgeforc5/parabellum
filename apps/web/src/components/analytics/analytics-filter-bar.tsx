'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AnalyticsEquipmentTile, LossStatusKey } from '@/lib/strapi';

interface AnalyticsFilterBarProps {
  tiles: AnalyticsEquipmentTile[];
  equipmentModels: Array<{ name: string; slug: string }>;
  regions: Array<{ name: string; slug: string }>;
  labels: {
    allStatuses: string;
    destroyed: string;
    captured: string;
    abandoned: string;
    damaged: string;
    filterType: string;
    filterModel: string;
    filterInscription: string;
    filterRegion: string;
    filterDateFrom: string;
    filterDateTo: string;
    filterReset: string;
    filterSearch: string;
  };
}

const STATUS_KEYS: Array<LossStatusKey | 'all'> = [
  'all',
  'destroyed',
  'captured',
  'abandoned',
  'damaged',
];

const STATUS_ACTIVE_COLORS: Record<LossStatusKey, string> = {
  destroyed: 'border-red-500/60 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold',
  damaged: 'border-orange-500/60 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold',
  captured: 'border-blue-500/60 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold',
  abandoned: 'border-zinc-500/60 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 font-semibold',
};

export function AnalyticsFilterBar({ tiles, equipmentModels, regions, labels }: AnalyticsFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(searchParams.get('status') ?? 'all');
  const [type, setType] = useState(searchParams.get('type') ?? '');
  const [model, setModel] = useState(searchParams.get('model') ?? '');
  const [inscription, setInscription] = useState(searchParams.get('inscription') ?? '');
  const [region, setRegion] = useState(searchParams.get('region') ?? '');
  const [dateFrom, setDateFrom] = useState(searchParams.get('from') ?? '');
  const [dateTo, setDateTo] = useState(searchParams.get('to') ?? '');

  useEffect(() => {
    setType(searchParams.get('type') ?? '');
    setStatus(searchParams.get('status') ?? 'all');
    setRegion(searchParams.get('region') ?? '');
  }, [searchParams]);

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    const set = (key: string, val: string) => {
      if (val && val !== 'all' && val !== '__all__') params.set(key, val);
      else params.delete(key);
    };
    set('status', status);
    set('type', type);
    set('model', model.trim());
    set('inscription', inscription.trim());
    set('region', region);
    set('from', dateFrom);
    set('to', dateTo);
    params.delete('page');
    router.replace(
      params.size > 0 ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false },
    );
  }

  function resetFilters() {
    setStatus('all');
    setType('');
    setModel('');
    setInscription('');
    setRegion('');
    setDateFrom('');
    setDateTo('');
    const params = new URLSearchParams(searchParams.toString());
    for (const key of ['status', 'type', 'model', 'inscription', 'region', 'from', 'to', 'page']) {
      params.delete(key);
    }
    router.replace(
      params.size > 0 ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false },
    );
  }

  const statusLabels: Record<LossStatusKey | 'all', string> = {
    all: labels.allStatuses,
    destroyed: labels.destroyed,
    captured: labels.captured,
    abandoned: labels.abandoned,
    damaged: labels.damaged,
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-4">
      {/* Status toggles */}
      <div className="flex flex-wrap gap-2">
        {STATUS_KEYS.map((key) => {
          const isActive = status === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-all',
                isActive
                  ? key === 'all'
                    ? 'border-foreground/40 bg-foreground text-background font-semibold'
                    : STATUS_ACTIVE_COLORS[key as LossStatusKey]
                  : 'border-border/60 bg-background/60 text-muted-foreground hover:border-border hover:text-foreground',
              )}
            >
              {statusLabels[key]}
            </button>
          );
        })}
      </div>

      {/* Row 1: type, model (datalist), inscription */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Select value={type || '__all__'} onValueChange={(v) => setType(v === '__all__' ? '' : v)}>
          <SelectTrigger>
            <SelectValue placeholder={labels.filterType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{labels.filterType}</SelectItem>
            {tiles.map((tile) => (
              <SelectItem key={tile.slug} value={tile.slug}>
                {tile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div>
          <Input
            list="equipment-models-list"
            placeholder={labels.filterModel}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            autoComplete="off"
          />
          <datalist id="equipment-models-list">
            {equipmentModels.map((m) => (
              <option key={m.slug} value={m.name} />
            ))}
          </datalist>
        </div>

        <Input
          placeholder={labels.filterInscription}
          value={inscription}
          onChange={(e) => setInscription(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
        />
      </div>

      {/* Row 2: region (select), date from, date to */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Select value={region || '__all__'} onValueChange={(v) => setRegion(v === '__all__' ? '' : v)}>
          <SelectTrigger>
            <SelectValue placeholder={labels.filterRegion} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{labels.filterRegion}</SelectItem>
            {regions.map((r) => (
              <SelectItem key={r.slug} value={r.slug}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          title={labels.filterDateFrom}
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          title={labels.filterDateTo}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          {labels.filterReset}
        </Button>
        <Button size="sm" onClick={applyFilters}>
          {labels.filterSearch}
        </Button>
      </div>
    </div>
  );
}
