import type { API } from '@strapi/client';
import { unstable_cache } from 'next/cache';
import type { AppLocale } from '@/i18n/routing';
import { strapiClient } from './client';
import {
  mapBlogPost,
  mapBlogPostCategory,
  mapDestroyedEquipment,
  mapWarConflict,
} from './mappers';
import type {
  BlogPost,
  BlogPostCategory,
  ConflictAnalyticsSectionData,
  DestroyedEquipment,
  HomeCategoryStats,
  HomeHeroStats,
  HomePageAnalytics,
  HomeTimelinePoint,
  LossStatusKey,
  ReadTimeBucket,
  StrapiBlogPost,
  StrapiBlogPostCategory,
  StrapiDestroyedEquipment,
  StrapiWarConflict,
  WarConflict,
} from './types';

const BLOG_POST_POPULATE = {
  coverImage: true,
  category: true,
} as const;
const DESTROYED_EQUIPMENT_POPULATE = {
  country: true,
  destroyedBy: true,
  equipment: {
    populate: {
      originCountry: true,
      type: {
        populate: {
          previewSvg: true,
        },
      },
    },
  },
  region: true,
  status: true,
  warConflict: true,
} as const;
const HOME_PAGE_ANALYTICS_POPULATE = {
  status: true,
  equipment: {
    populate: {
      type: true,
    },
  },
} as const;
const HOME_PAGE_ANALYTICS_REVALIDATE_SECONDS = 300;
const HOME_PAGE_ANALYTICS_PAGE_SIZE = 250;
const MIN_HOME_TIMELINE_MONTH = '2023-05';
const TRACKED_STATUS_KEYS = [
  'destroyed',
  'damaged',
  'captured',
  'abandoned',
] as const;

type CollectionResponse<TDocument> = Omit<
  API.DocumentResponseCollection,
  'data'
> & {
  data: TDocument[];
};

function blogPostFilters(
  categorySlug?: string,
  readTimeBucket?: ReadTimeBucket,
): API.BaseQueryParams['filters'] {
  const filters: Record<string, unknown> = {};

  if (categorySlug) {
    filters.category = { slug: { $eq: categorySlug } };
  }

  if (readTimeBucket === 'short') {
    filters.readTime = { $lte: 5 };
  }

  if (readTimeBucket === 'medium') {
    filters.readTime = { $gte: 6, $lte: 15 };
  }

  if (readTimeBucket === 'long') {
    filters.readTime = { $gte: 16 };
  }

  return Object.keys(filters).length > 0 ? filters : undefined;
}

async function findCollection<TDocument>(
  resource: string,
  query?: API.BaseQueryParams,
): Promise<CollectionResponse<TDocument>> {
  return (await strapiClient
    .collection(resource)
    .find(query)) as CollectionResponse<TDocument>;
}

async function getCollectionCount(
  resource: string,
  query?: Omit<API.BaseQueryParams, 'pagination'>,
) {
  const response = await findCollection<never>(resource, {
    ...query,
    pagination: {
      page: 1,
      pageSize: 1,
      withCount: true,
    },
  });

  return response.meta.pagination?.total ?? 0;
}

async function findAllCollection<TDocument>(
  resource: string,
  query?: Omit<API.BaseQueryParams, 'pagination'>,
  pageSize = HOME_PAGE_ANALYTICS_PAGE_SIZE,
): Promise<TDocument[]> {
  const firstPage = await findCollection<TDocument>(resource, {
    ...query,
    pagination: {
      page: 1,
      pageSize,
      withCount: true,
    },
  });

  const pageCount = firstPage.meta.pagination?.pageCount ?? 1;

  if (pageCount <= 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      findCollection<TDocument>(resource, {
        ...query,
        pagination: {
          page: index + 2,
          pageSize,
        },
      }),
    ),
  );

  return [
    ...firstPage.data,
    ...remainingPages.flatMap((page) => page.data),
  ];
}

function createEmptyStatusTotals(): Record<LossStatusKey, number> {
  return {
    destroyed: 0,
    damaged: 0,
    captured: 0,
    abandoned: 0,
  };
}

function asTrackedStatusKey(
  value: string | null | undefined,
): LossStatusKey | null {
  return TRACKED_STATUS_KEYS.includes(value as LossStatusKey)
    ? (value as LossStatusKey)
    : null;
}

function toMonthKey(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const match = /^(\d{4}-\d{2})/.exec(value);
  return match?.[1] ?? null;
}

function buildHomePageAnalytics(input: {
  activeConflicts: number;
  blogPosts: number;
  losses: DestroyedEquipment[];
}): HomePageAnalytics {
  const lossAnalytics = buildLossAnalytics(input.losses);

  return {
    heroStats: {
      verifiedLosses: lossAnalytics.verifiedLosses,
      activeConflicts: input.activeConflicts,
      blogPosts: input.blogPosts,
    },
    timeline: lossAnalytics.timeline,
    categories: lossAnalytics.categories,
  };
}

function buildLossAnalytics(losses: DestroyedEquipment[]) {
  const timelineByMonth = new Map<string, HomeTimelinePoint>();
  const categoriesBySlug = new Map<string, HomeCategoryStats>();
  let verifiedLosses = 0;

  for (const loss of losses) {
    const quantity =
      Number.isFinite(loss.quantity) && loss.quantity > 0 ? loss.quantity : 1;
    const statusKey = asTrackedStatusKey(loss.status?.slug);
    const monthKey = toMonthKey(loss.eventDate ?? loss.reportedAt);
    const categorySlug = loss.equipment?.type?.slug ?? 'unknown';
    const categoryName = loss.equipment?.type?.name ?? 'Unknown';

    verifiedLosses += quantity;

    if (monthKey && monthKey >= MIN_HOME_TIMELINE_MONTH) {
      const timelinePoint = timelineByMonth.get(monthKey) ?? {
        date: monthKey,
        count: 0,
        destroyed: 0,
        damaged: 0,
        captured: 0,
        abandoned: 0,
      };

      timelinePoint.count += quantity;

      if (statusKey) {
        timelinePoint[statusKey] += quantity;
      }

      timelineByMonth.set(monthKey, timelinePoint);
    }

    const category = categoriesBySlug.get(categorySlug) ?? {
      name: categoryName,
      slug: categorySlug,
      count: 0,
      byStatus: createEmptyStatusTotals(),
    };

    category.count += quantity;

    if (statusKey) {
      category.byStatus[statusKey] += quantity;
    }

    categoriesBySlug.set(categorySlug, category);
  }

  return {
    verifiedLosses,
    timeline: Array.from(timelineByMonth.values()).sort((left, right) =>
      left.date.localeCompare(right.date),
    ),
    categories: Array.from(categoriesBySlug.values())
      .sort((left, right) => {
        if (right.count !== left.count) {
          return right.count - left.count;
        }

        return left.name.localeCompare(right.name);
      })
      .slice(0, 8),
  };
}

function resolveSelectedConflict(
  conflicts: WarConflict[],
  requestedConflictSlug?: string,
) {
  if (requestedConflictSlug) {
    const selectedConflict = conflicts.find(
      (conflict) => conflict.slug === requestedConflictSlug,
    );

    if (selectedConflict) {
      return selectedConflict;
    }
  }

  return conflicts[0] ?? null;
}

const getCachedHomePageAnalytics = unstable_cache(
  async (locale?: AppLocale): Promise<HomePageAnalytics> => {
    const today = new Date().toISOString().slice(0, 10);

    const [activeConflicts, blogPosts, losses] = await Promise.all([
      getCollectionCount('war-conflicts', {
        filters: {
          $or: [
            {
              endDate: {
                $null: true,
              },
            },
            {
              endDate: {
                $gte: today,
              },
            },
          ],
        },
      }),
      getCollectionCount('blog-posts', {
        ...(locale ? { locale } : {}),
        status: 'published',
      }),
      findAllCollection<StrapiDestroyedEquipment>('destroyed-equipments', {
        populate: HOME_PAGE_ANALYTICS_POPULATE,
        sort: ['reportedAt:asc', 'sourceRecordId:asc'],
      }).then((documents) => documents.map(mapDestroyedEquipment)),
    ]);

    return buildHomePageAnalytics({
      activeConflicts,
      blogPosts,
      losses,
    });
  },
  ['home-page-analytics'],
  {
    revalidate: HOME_PAGE_ANALYTICS_REVALIDATE_SECONDS,
  },
);

const getCachedHeroStats = unstable_cache(
  async (locale?: AppLocale): Promise<HomeHeroStats> => {
    const today = new Date().toISOString().slice(0, 10);

    const [activeConflicts, blogPosts, losses] = await Promise.all([
      getCollectionCount('war-conflicts', {
        filters: {
          $or: [
            {
              endDate: {
                $null: true,
              },
            },
            {
              endDate: {
                $gte: today,
              },
            },
          ],
        },
      }),
      getCollectionCount('blog-posts', {
        ...(locale ? { locale } : {}),
        status: 'published',
      }),
      findAllCollection<StrapiDestroyedEquipment>('destroyed-equipments', {
        sort: ['sourceRecordId:asc'],
      }),
    ]);

    const verifiedLosses = losses.reduce((total, loss) => {
      const quantity =
        typeof loss.quantity === 'number' && loss.quantity > 0
          ? loss.quantity
          : 1;
      return total + quantity;
    }, 0);

    return {
      verifiedLosses,
      activeConflicts,
      blogPosts,
    };
  },
  ['hero-stats'],
  {
    revalidate: HOME_PAGE_ANALYTICS_REVALIDATE_SECONDS,
  },
);

const getCachedConflictAnalyticsSectionData = unstable_cache(
  async (
    requestedConflictSlug?: string,
  ): Promise<ConflictAnalyticsSectionData> => {
    const conflicts = await findAllCollection<StrapiWarConflict>(
      'war-conflicts',
      {
        sort: ['startDate:desc', 'name:asc'],
      },
    ).then((documents) => documents.map(mapWarConflict));

    const selectedConflict = resolveSelectedConflict(
      conflicts,
      requestedConflictSlug,
    );

    if (!selectedConflict) {
      return {
        conflicts: [],
        selectedConflict: null,
        timeline: [],
        categories: [],
      };
    }

    const losses = await findAllCollection<StrapiDestroyedEquipment>(
      'destroyed-equipments',
      {
        populate: HOME_PAGE_ANALYTICS_POPULATE,
        sort: ['reportedAt:asc', 'sourceRecordId:asc'],
        filters: {
          warConflict: {
            slug: {
              $eq: selectedConflict.slug,
            },
          },
        },
      },
    ).then((documents) => documents.map(mapDestroyedEquipment));

    const lossAnalytics = buildLossAnalytics(losses);

    return {
      conflicts,
      selectedConflict,
      timeline: lossAnalytics.timeline,
      categories: lossAnalytics.categories,
    };
  },
  ['conflict-analytics-section'],
  {
    revalidate: HOME_PAGE_ANALYTICS_REVALIDATE_SECONDS,
  },
);

export async function getBlogPosts(options?: {
  locale?: AppLocale;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  readTimeBucket?: ReadTimeBucket;
}): Promise<{ posts: BlogPost[]; total: number }> {
  const {
    locale,
    page = 1,
    pageSize = 10,
    categorySlug,
    readTimeBucket,
  } = options ?? {};

  const response = await findCollection<StrapiBlogPost>('blog-posts', {
    ...(locale ? { locale } : {}),
    populate: BLOG_POST_POPULATE,
    filters: blogPostFilters(categorySlug, readTimeBucket),
    sort: ['publishedAt:desc'],
    pagination: {
      page,
      pageSize,
      withCount: true,
    },
    status: 'published',
  });

  return {
    posts: response.data.map(mapBlogPost),
    total: response.meta.pagination?.total ?? 0,
  };
}

export async function getBlogPost(
  slug: string,
  locale?: AppLocale,
): Promise<BlogPost | null> {
  const response = await findCollection<StrapiBlogPost>('blog-posts', {
    ...(locale ? { locale } : {}),
    populate: BLOG_POST_POPULATE,
    filters: {
      slug: { $eq: slug },
    },
    pagination: {
      page: 1,
      pageSize: 1,
    },
    status: 'published',
  });

  const [post] = response.data;
  return post ? mapBlogPost(post) : null;
}

export async function getBlogPostCategories(
  locale?: AppLocale,
): Promise<BlogPostCategory[]> {
  const response = await findCollection<StrapiBlogPostCategory>(
    'blog-post-categories',
    {
      ...(locale ? { locale } : {}),
      sort: ['name:asc'],
      pagination: {
        page: 1,
        pageSize: 100,
      },
    },
  );

  return response.data.map(mapBlogPostCategory);
}

export async function getRecentDestroyedEquipment(options?: {
  pageSize?: number;
}): Promise<DestroyedEquipment[]> {
  const { pageSize = 6 } = options ?? {};

  const response = await findCollection<StrapiDestroyedEquipment>(
    'destroyed-equipments',
    {
      populate: DESTROYED_EQUIPMENT_POPULATE,
      sort: ['reportedAt:desc', 'sourceRecordId:desc'],
      pagination: {
        page: 1,
        pageSize,
      },
    },
  );

  return response.data.map(mapDestroyedEquipment);
}

export async function getHomePageAnalytics(
  locale?: AppLocale,
): Promise<HomePageAnalytics> {
  return getCachedHomePageAnalytics(locale);
}

export async function getConflictAnalyticsSectionData(
  requestedConflictSlug?: string,
): Promise<ConflictAnalyticsSectionData> {
  return getCachedConflictAnalyticsSectionData(requestedConflictSlug);
}

export async function getHeroStats(
  locale?: AppLocale,
): Promise<HomeHeroStats> {
  return getCachedHeroStats(locale);
}

export type {
  BlogPost,
  BlogPostCategory,
  BlogPostContent,
  ConflictAnalyticsSectionData,
  DestroyedEquipment,
  HomeCategoryStats,
  HomeHeroStats,
  HomePageAnalytics,
  HomeTimelinePoint,
  LossStatusKey,
  ReadTimeBucket,
  WarConflict,
} from './types';
