import { getTranslations } from 'next-intl/server';
import { CategoryBarChart } from '@/components/charts/category-bar-chart';
import { TimelineChart } from '@/components/charts/timeline-chart';
import { ConflictAnalyticsSelect } from '@/components/landing/conflict-analytics-select';
import { getConflictAnalyticsSectionData } from '@/lib/strapi';

interface ConflictAnalyticsSectionProps {
  searchParams?: Promise<{ conflict?: string | string[] }>;
}

export async function ConflictAnalyticsSection({
  searchParams,
}: ConflictAnalyticsSectionProps) {
  const params = await searchParams;
  const selectedConflictSlug = Array.isArray(params?.conflict)
    ? params.conflict[0]
    : params?.conflict;
  const [charts, conflictData] = await Promise.all([
    getTranslations('Charts'),
    getConflictAnalyticsSectionData(selectedConflictSlug).catch(() => ({
      conflicts: [],
      selectedConflict: null,
      timeline: [],
      categories: [],
    })),
  ]);

  return (
    <section className="py-16">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {conflictData.selectedConflict?.name ?? charts('analyticsFallbackTitle')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {charts('conflictHint')}
          </p>
        </div>
        <ConflictAnalyticsSelect
          conflicts={conflictData.conflicts}
          selectedConflictSlug={conflictData.selectedConflict?.slug ?? null}
          label={charts('conflictLabel')}
          placeholder={charts('conflictPlaceholder')}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TimelineChart
          data={conflictData.timeline}
          title={charts('timelineTitle')}
        />
        <CategoryBarChart
          data={conflictData.categories}
          title={charts('categoryTitle')}
        />
      </div>
    </section>
  );
}
