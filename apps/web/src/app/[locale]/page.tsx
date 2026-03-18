import { withLocale } from '@/lib/with-locale';
import {
  getBlogPosts,
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
  const resolvedSearchParams = await searchParams;
  const selectedConflictSlug = Array.isArray(resolvedSearchParams?.conflict)
    ? resolvedSearchParams?.conflict[0]
    : resolvedSearchParams?.conflict;

  const [heroStats, blogPostsResult, losses] = await Promise.all([
    getHeroStats(locale as AppLocale).catch(() => null),
    getBlogPosts({
      locale: locale as AppLocale,
      pageSize: 3,
    }).catch(() => {
      return {
        posts: [],
      };
    }),
    getRecentDestroyedEquipment({
      pageSize: 6,
    }).catch(() => []),
  ]);

  return (
    <div>
      <HeroSection stats={heroStats} />
      <PlatformCards />
      <BlogPreview posts={blogPostsResult.posts} />
      <FeatureCarousel />
      <ConflictAnalyticsSection selectedConflictSlug={selectedConflictSlug} />
      <RecentLosses losses={losses} />
    </div>
  );
});
