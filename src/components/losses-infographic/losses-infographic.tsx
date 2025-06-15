import React, { ComponentProps, Suspense } from 'react';
import { LocationGraph } from '@/components/losses-infographic/location/location-graph';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { LossCount } from '@/components/losses-infographic/loss-count/loss-count';
import { Skeleton } from '@/components/ui/skeleton';
import { TechCards } from '@/components/losses-infographic/tech-items/tech-cards';
import { ErrorBoundary } from 'react-error-boundary';
import { Location } from '@/components/losses-infographic/location/location';
import { getTimePeriod } from '@/components/losses-infographic/getTimePeriod';

const locationData: ComponentProps<typeof LocationGraph> = {
  data: [
    {
      region: 'DPR',
      value: 250,
      label: 'ДНР',
    },
    {
      region: 'LPR',
      value: 500,
      label: 'ЛНР',
    },
    {
      region: 'KHR',
      value: 750,
      label: 'Херсонская область',
    },
    {
      region: 'ZAP',
      value: 250,
      label: 'Запорожская область',
    },
  ],
};

export async function LossesInfographic() {
  return (
    <ErrorBoundary fallback={null}>
      <SectionWrapper>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Подтвержденные потери ВСУ</h2>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary"></div>
            <span className="text-primary font-semibold">{getTimePeriod().timePeriod}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Suspense fallback={<Skeleton className="min-h-48 md:min-h-[500px] h-full w-full rounded-md" />}>
            <LossCount />
          </Suspense>
          <Suspense fallback={<Skeleton className="min-h-48 md:min-h-[500px] h-full w-full rounded-md" />}>
            <Location />
          </Suspense>
          <Suspense fallback={<Skeleton className="min-h-48 md:min-h-[400px] h-full w-full rounded-md" />}>
            <TechCards />
          </Suspense>
        </div>
      </SectionWrapper>
    </ErrorBoundary>
  );
}
