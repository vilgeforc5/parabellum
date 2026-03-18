import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { withLocale } from '@/lib/with-locale';
import { getAnalyticsPageData } from '@/lib/strapi';
import { Link } from '@/i18n/navigation';
import { ConflictAnalyticsSelect } from '@/components/landing/conflict-analytics-select';
import { TimelineChart } from '@/components/charts/timeline-chart';
import { CategoryBarChart } from '@/components/charts/category-bar-chart';
import { StatusDonutChart } from '@/components/charts/status-donut-chart';
import { CumulativeTimelineChart } from '@/components/charts/cumulative-timeline-chart';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Charts — Analytics',
};

export default withLocale(async function ChartsPage({
  searchParams,
}: {
  locale: string;
  searchParams?: Promise<{ conflict?: string | string[] }>;
}) {
  const params = await searchParams;
  const conflictSlug = Array.isArray(params?.conflict)
    ? params.conflict[0]
    : params?.conflict;

  const [analyticsData, t] = await Promise.all([
    getAnalyticsPageData(conflictSlug).catch(() => ({
      conflicts: [],
      selectedConflict: null,
      timeline: [],
      categories: [],
      tiles: [],
      total: 0,
      totalByStatus: { destroyed: 0, damaged: 0, captured: 0, abandoned: 0 },
    })),
    getTranslations('AnalyticsPage'),
  ]);

  return (
    <div className="container mx-auto max-w-screen-xl py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link
            href={`/analytics${analyticsData.selectedConflict?.slug ? `?conflict=${analyticsData.selectedConflict.slug}` : ''}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToAnalytics')}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('chartsTitle')}
          </h1>
          {analyticsData.selectedConflict && (
            <p className="text-muted-foreground">
              {analyticsData.selectedConflict.name}
            </p>
          )}
        </div>
        <ConflictAnalyticsSelect
          conflicts={analyticsData.conflicts}
          selectedConflictSlug={analyticsData.selectedConflict?.slug ?? null}
          label={t('conflictLabel')}
          placeholder={t('conflictPlaceholder')}
        />
      </div>

      {/* Summary counts */}
      {analyticsData.total > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              {
                label: t('destroyed'),
                value: analyticsData.totalByStatus.destroyed,
                color: 'text-red-500',
              },
              {
                label: t('captured'),
                value: analyticsData.totalByStatus.captured,
                color: 'text-blue-500',
              },
              {
                label: t('abandoned'),
                value: analyticsData.totalByStatus.abandoned,
                color: 'text-zinc-500',
              },
              {
                label: t('damaged'),
                value: analyticsData.totalByStatus.damaged,
                color: 'text-orange-500',
              },
            ] as const
          ).map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-border/60 bg-card/60 p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className={`mt-1 text-2xl font-bold tabular-nums ${color}`}>
                {value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Charts 2×2 grid */}
      {analyticsData.timeline.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <TimelineChart
            data={analyticsData.timeline}
            title={t('timelineTitle')}
          />
          <StatusDonutChart
            data={analyticsData.totalByStatus}
            title={t('statusDistributionTitle')}
          />
          <CumulativeTimelineChart
            data={analyticsData.timeline}
            title={t('cumulativeTitle')}
          />
          <CategoryBarChart
            data={analyticsData.categories.slice(0, 10)}
            title={t('categoryTitle')}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-border/60 bg-card/40 py-20 text-center">
          <p className="text-muted-foreground">{t('noLosses')}</p>
        </div>
      )}
    </div>
  );
});
