import React, { Suspense } from 'react';
import { Hero } from '@/components/hero/hero';
import { LossesInfographic } from '@/components/losses-infographic/losses-infographic';
import { Skeleton } from '@/components/ui/skeleton';
import { RecentLoss } from '@/components/recent-loss-table/recent-loss';
import { ErrorBoundary } from 'react-error-boundary';

export default async function HomePage() {
  return (
    <div className="flex justify-center flex-col gap-10 lg:gap-20 container mx-auto">
      <Hero className="mt-10" />
      <LossesInfographic />

      <ErrorBoundary fallback={null}>
        <Suspense fallback={<Skeleton className="w-full min-h-96" />}>
          <RecentLoss />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
