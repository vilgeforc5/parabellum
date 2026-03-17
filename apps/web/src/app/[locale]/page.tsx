import { getTranslations } from 'next-intl/server';
import { withLocale } from '@/lib/with-locale';
import type {
  CategoryBreakdown,
  TimelineDataPoint,
} from '@parabellum/contracts';
import { CategoryBarChart } from '@/components/charts/category-bar-chart';
import { TimelineChart } from '@/components/charts/timeline-chart';
import { HeroSection } from '@/components/landing/hero-section';
import { FeatureCarousel } from '@/components/landing/feature-carousel';
import { PlatformCards } from '@/components/landing/platform-cards';
import { BlogPreview } from '@/components/landing/blog-preview';
import { RecentLosses } from '@/components/landing/recent-losses';

const mockTimeline: TimelineDataPoint[] = [
  {
    date: '2024-01',
    count: 142,
    destroyed: 89,
    damaged: 28,
    captured: 18,
    abandoned: 7,
  },
  {
    date: '2024-02',
    count: 168,
    destroyed: 104,
    damaged: 32,
    captured: 22,
    abandoned: 10,
  },
  {
    date: '2024-03',
    count: 195,
    destroyed: 121,
    damaged: 38,
    captured: 25,
    abandoned: 11,
  },
  {
    date: '2024-04',
    count: 156,
    destroyed: 97,
    damaged: 29,
    captured: 20,
    abandoned: 10,
  },
  {
    date: '2024-05',
    count: 183,
    destroyed: 115,
    damaged: 35,
    captured: 23,
    abandoned: 10,
  },
  {
    date: '2024-06',
    count: 201,
    destroyed: 128,
    damaged: 36,
    captured: 26,
    abandoned: 11,
  },
  {
    date: '2024-07',
    count: 178,
    destroyed: 110,
    damaged: 34,
    captured: 24,
    abandoned: 10,
  },
  {
    date: '2024-08',
    count: 164,
    destroyed: 103,
    damaged: 30,
    captured: 21,
    abandoned: 10,
  },
];

const mockCategories: CategoryBreakdown[] = [
  {
    category: {
      id: 1,
      name: 'Tanks',
      slug: 'tanks',
      iconUrl: null,
      parentId: null,
      children: [],
      sortOrder: 1,
    },
    count: 487,
    byStatus: { destroyed: 312, damaged: 89, captured: 62, abandoned: 24 },
  },
  {
    category: {
      id: 2,
      name: 'APCs/IFVs',
      slug: 'apcs-ifvs',
      iconUrl: null,
      parentId: null,
      children: [],
      sortOrder: 2,
    },
    count: 623,
    byStatus: { destroyed: 389, damaged: 112, captured: 78, abandoned: 44 },
  },
  {
    category: {
      id: 3,
      name: 'Artillery',
      slug: 'artillery',
      iconUrl: null,
      parentId: null,
      children: [],
      sortOrder: 3,
    },
    count: 341,
    byStatus: { destroyed: 218, damaged: 67, captured: 38, abandoned: 18 },
  },
  {
    category: {
      id: 4,
      name: 'MLRS',
      slug: 'mlrs',
      iconUrl: null,
      parentId: null,
      children: [],
      sortOrder: 4,
    },
    count: 89,
    byStatus: { destroyed: 56, damaged: 18, captured: 10, abandoned: 5 },
  },
  {
    category: {
      id: 5,
      name: 'SAM Systems',
      slug: 'sam-systems',
      iconUrl: null,
      parentId: null,
      children: [],
      sortOrder: 5,
    },
    count: 127,
    byStatus: { destroyed: 81, damaged: 24, captured: 16, abandoned: 6 },
  },
  {
    category: {
      id: 6,
      name: 'Aircraft',
      slug: 'aircraft',
      iconUrl: null,
      parentId: null,
      children: [],
      sortOrder: 6,
    },
    count: 94,
    byStatus: { destroyed: 72, damaged: 14, captured: 5, abandoned: 3 },
  },
  {
    category: {
      id: 7,
      name: 'UAVs',
      slug: 'uavs',
      iconUrl: null,
      parentId: null,
      children: [],
      sortOrder: 7,
    },
    count: 412,
    byStatus: { destroyed: 298, damaged: 64, captured: 35, abandoned: 15 },
  },
];

export default withLocale(async function HomePage() {
  const charts = await getTranslations('Charts');

  return (
    <div>
      <HeroSection />
      <PlatformCards />
      <BlogPreview />
      <FeatureCarousel />
      <section className="py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <TimelineChart data={mockTimeline} title={charts('timelineTitle')} />
          <CategoryBarChart
            data={mockCategories}
            title={charts('categoryTitle')}
          />
        </div>
      </section>
      <RecentLosses />
    </div>
  );
});
