import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BarChart3 } from 'lucide-react';
import { withLocale } from '@/lib/with-locale';
import { getAnalyticsLosses, getAnalyticsPageData, getEquipmentList, getRegions } from '@/lib/strapi';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ConflictAnalyticsSelect } from '@/components/landing/conflict-analytics-select';
import { EquipmentTypeGrid } from '@/components/analytics/equipment-type-grid';
import { AnalyticsFilterBar } from '@/components/analytics/analytics-filter-bar';
import { LossesTable } from '@/components/analytics/losses-table';
import { PageSizeSelector } from '@/components/analytics/page-size-selector';

const VALID_PAGE_SIZES = [20, 25, 30, 50];

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Analytics',
};

type SearchParams = {
  conflict?: string | string[];
  status?: string | string[];
  type?: string | string[];
  country?: string | string[];
  model?: string | string[];
  inscription?: string | string[];
  region?: string | string[];
  from?: string | string[];
  to?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
};

function firstString(val: string | string[] | undefined): string | undefined {
  if (!val) return undefined;
  return Array.isArray(val) ? val[0] : val;
}

const DEFAULT_PAGE_SIZE = 25;

export default withLocale(async function AnalyticsPage({
  searchParams,
}: {
  locale: string;
  searchParams?: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const conflictSlug = firstString(params?.conflict);
  const statusSlug = firstString(params?.status);
  const equipmentTypeSlug = firstString(params?.type);
  const countrySlug = firstString(params?.country);
  const model = firstString(params?.model);
  const inscription = firstString(params?.inscription);
  const regionSlug = firstString(params?.region);
  const dateFrom = firstString(params?.from);
  const dateTo = firstString(params?.to);
  const page = Math.max(1, Number(firstString(params?.page) ?? '1') || 1);

  const rawPageSize = Number(
    firstString(params?.pageSize) ?? DEFAULT_PAGE_SIZE,
  );
  const pageSize = VALID_PAGE_SIZES.includes(rawPageSize)
    ? rawPageSize
    : DEFAULT_PAGE_SIZE;

  const [analyticsData, lossesResult, equipmentModels, regions, t] =
    await Promise.all([
      getAnalyticsPageData(conflictSlug).catch(() => ({
        conflicts: [],
        selectedConflict: null,
        timeline: [],
        categories: [],
        tiles: [],
        total: 0,
        totalByStatus: { destroyed: 0, damaged: 0, captured: 0, abandoned: 0 },
      })),
      getAnalyticsLosses({
        conflictSlug: conflictSlug ?? 'russo-ukrainian-war',
        page,
        pageSize,
        statusSlug: statusSlug && statusSlug !== 'all' ? statusSlug : undefined,
        equipmentTypeSlug,
        countrySlug,
        model,
        inscription,
        regionSlug,
        dateFrom,
        dateTo,
      }).catch(() => ({ losses: [], total: 0 })),
      // Filter models by selected equipment type so the dropdown is relevant
      getEquipmentList(equipmentTypeSlug).catch(() => []),
      getRegions().catch(() => []),
      getTranslations('AnalyticsPage'),
    ]);

  const resolvedConflictSlug =
    analyticsData.selectedConflict?.slug ??
    conflictSlug ??
    'russo-ukrainian-war';

  // Build current params for pagination links (must include pageSize)
  const currentParamEntries: Record<string, string> = {};
  if (resolvedConflictSlug) currentParamEntries.conflict = resolvedConflictSlug;
  if (statusSlug) currentParamEntries.status = statusSlug;
  if (equipmentTypeSlug) currentParamEntries.type = equipmentTypeSlug;
  if (countrySlug) currentParamEntries.country = countrySlug;
  if (model) currentParamEntries.model = model;
  if (inscription) currentParamEntries.inscription = inscription;
  if (regionSlug) currentParamEntries.region = regionSlug;
  if (dateFrom) currentParamEntries.from = dateFrom;
  if (dateTo) currentParamEntries.to = dateTo;
  if (pageSize !== DEFAULT_PAGE_SIZE)
    currentParamEntries.pageSize = String(pageSize);

  const statsItems = [
    {
      key: 'destroyed',
      label: t('destroyed'),
      value: analyticsData.totalByStatus.destroyed,
      color: 'text-red-500',
    },
    {
      key: 'captured',
      label: t('captured'),
      value: analyticsData.totalByStatus.captured,
      color: 'text-blue-500',
    },
    {
      key: 'abandoned',
      label: t('abandoned'),
      value: analyticsData.totalByStatus.abandoned,
      color: 'text-zinc-500',
    },
    {
      key: 'damaged',
      label: t('damaged'),
      value: analyticsData.totalByStatus.damaged,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-6 sm:py-8 space-y-5 sm:space-y-8">
      {/* Header — mobile: title row + full-width select below; desktop: title left, select+button right */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-4">
        {/* Title row: on mobile also houses the icon-only charts button */}
        <div className="flex items-start justify-between gap-2 min-w-0 sm:block sm:space-y-1">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{t('description')}</p>
          </div>
          <Button variant="outline" size="icon" asChild className="shrink-0 sm:hidden">
            <Link href={`/analytics/charts${resolvedConflictSlug ? `?conflict=${resolvedConflictSlug}` : ''}`}>
              <BarChart3 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        {/* Conflict select + desktop charts button */}
        <div className="flex items-end gap-3">
          <div className="flex-1 sm:flex-none">
            <ConflictAnalyticsSelect
              conflicts={analyticsData.conflicts}
              selectedConflictSlug={analyticsData.selectedConflict?.slug ?? null}
              label={t('conflictLabel')}
              placeholder={t('conflictPlaceholder')}
            />
          </div>
          <Button variant="outline" size="sm" asChild className="gap-2 mb-0.5 hidden sm:flex">
            <Link href={`/analytics/charts${resolvedConflictSlug ? `?conflict=${resolvedConflictSlug}` : ''}`}>
              <BarChart3 className="h-4 w-4" />
              {t('viewCharts')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary stats — scrollable strip on mobile, 5-col grid on desktop */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 sm:pb-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible">
        <div className="min-w-[120px] flex-shrink-0 sm:flex-shrink sm:min-w-0 rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 sm:p-4">
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
            {t('totalLost')}
          </p>
          <p className="mt-0.5 sm:mt-1 text-2xl sm:text-3xl font-bold tabular-nums">
            {analyticsData.total.toLocaleString()}
          </p>
        </div>
        {statsItems.map(({ key, label, value, color }) => (
          <div
            key={key}
            className="min-w-[100px] flex-shrink-0 sm:flex-shrink sm:min-w-0 rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 sm:p-4"
          >
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              {label}
            </p>
            <p className={`mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold tabular-nums ${color}`}>
              {value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Equipment type tiles */}
      {analyticsData.tiles.length > 0 && (
        <EquipmentTypeGrid
          tiles={analyticsData.tiles}
          selectedTypeSlug={equipmentTypeSlug ?? null}
          lostLabel={t('lostLabel')}
          damagedLabel={t('damagedLabel')}
        />
      )}

      {/* Losses table section — hidden on mobile, full table on sm+ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">
            {t('lossesTableTitle')}
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground tabular-nums hidden sm:block">
              {lossesResult.total.toLocaleString()} {t('lostLabel')}
            </p>
            <PageSizeSelector current={pageSize} label={t('perPage')} />
          </div>
        </div>

        <AnalyticsFilterBar
          tiles={analyticsData.tiles}
          equipmentModels={equipmentModels}
          regions={regions}
          labels={{
            allStatuses: t('allStatuses'),
            destroyed: t('destroyed'),
            captured: t('captured'),
            abandoned: t('abandoned'),
            damaged: t('damaged'),
            filterType: t('filterType'),
            filterModel: t('filterModel'),
            filterInscription: t('filterInscription'),
            filterRegion: t('filterRegion'),
            filterDateFrom: t('filterDateFrom'),
            filterDateTo: t('filterDateTo'),
            filterReset: t('filterReset'),
            filterSearch: t('filterSearch'),
          }}
        />

        <LossesTable
          losses={lossesResult.losses}
          total={lossesResult.total}
          page={page}
          pageSize={pageSize}
          conflictSlug={resolvedConflictSlug}
          labels={{
            columnMedia: t('columnMedia'),
            columnLoss: t('columnLoss'),
            columnLostBy: t('columnLostBy'),
            columnLocation: t('columnLocation'),
            columnDate: t('columnDate'),
            noLosses: t('noLosses'),
            noLossesHint: t('noLossesHint'),
            viewOnMap: t('viewOnMap'),
            prevPage: t('prevPage'),
            nextPage: t('nextPage'),
            pageOf: (p, tot) => `${p} / ${tot}`,
          }}
          currentParams={currentParamEntries}
        />
      </section>
    </div>
  );
});
