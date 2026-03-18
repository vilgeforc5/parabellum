import { Suspense } from 'react';
import { withLocale } from '@/lib/with-locale';
import {
  getBlogPostsPreview,
  getHeroStats,
  getRecentDestroyedEquipment,
} from '@/lib/strapi';
import type { AppLocale } from '@/i18n/routing';
import { HeroSection } from '@/components/landing/hero-section';
import { ConflictAnalyticsSection } from '@/components/landing/conflict-analytics-section';
import { FeatureCarousel } from '@/components/landing/feature-carousel';
import { PlatformCards } from '@/components/landing/platform-cards';
import { BlogPreview } from '@/components/landing/blog-preview';
import { RecentLosses } from '@/components/landing/recent-losses';

export const revalidate = 300;

export default withLocale(async function HomePage({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams?: Promise<{
    conflict?: string | string[];
  }>;
}) {
  const [heroStats, blogPostsResult, losses] = await Promise.all([
    getHeroStats(locale as AppLocale).catch(() => null),
    getBlogPostsPreview(locale as AppLocale).catch(() => ({ posts: [] })),
    getRecentDestroyedEquipment({ pageSize: 6 }).catch(() => []),
  ]);

  return (
    <div>
      <HeroSection stats={heroStats} />
      <PlatformCards />
      <BlogPreview posts={blogPostsResult.posts} />
      <FeatureCarousel />
      <Suspense fallback={null}>
        <ConflictAnalyticsSection searchParams={searchParams} />
      </Suspense>
      <RecentLosses losses={losses} />
    </div>
  );
});
