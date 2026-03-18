import type { API } from '@strapi/client';
import type { AppLocale } from '@/i18n/routing';
import { strapiClient } from './client';
import { mapBlogPost, mapBlogPostCategory, mapConflictEvent, mapDestroyedEquipment, mapEquipmentType, mapWarConflict } from './mappers';
import type {
  AnalyticsEquipmentTile,
  AnalyticsLossesResult,
  AnalyticsPageData,
  BlogPost,
  BlogPostCategory,
  ConflictAnalyticsSectionData,
  ConflictEvent,
  DestroyedEquipment,
  HomeCategoryStats,
  HomeHeroStats,
  HomePageAnalytics,
  HomeTimelinePoint,
  LossStatusKey,
  ReadTimeBucket,
  StrapiBlogPost,
  StrapiBlogPostCategory,
  StrapiConflictEvent,
  StrapiDestroyedEquipment,
  StrapiEquipmentType,
  StrapiWarConflict,
  WarConflict
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
const HOME_PAGE_ANALYTICS_PAGE_SIZE = 250;
const MIN_HOME_TIMELINE_MONTH = '2021-05';
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
  const start = performance.now();
  const page = query?.pagination && 'page' in query.pagination ? query.pagination.page : 1;
  const pageSize = query?.pagination && 'pageSize' in query.pagination ? query.pagination.pageSize : '?';
  const label = `[strapi] ${resource} p${page}/${pageSize}`;

  try {
    const result = (await strapiClient
      .collection(resource)
      .find(query)) as CollectionResponse<TDocument>;

    const ms = (performance.now() - start).toFixed(0);
    const count = result.data?.length ?? 0;
    const total = result.meta?.pagination?.total;
    console.log(`${label} → ${count} records${total != null ? ` (${total} total)` : ''} in ${ms}ms`);

    return result;
  } catch (error) {
    const ms = (performance.now() - start).toFixed(0);
    console.error(`${label} FAILED in ${ms}ms:`, error);
    throw error;
  }
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

  return [...firstPage.data, ...remainingPages.flatMap((page) => page.data)];
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

function buildLossAnalytics(losses: DestroyedEquipment[], maxCategories = 8) {
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
      .slice(0, maxCategories),
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

export async function getHeroStats(locale?: AppLocale): Promise<HomeHeroStats> {
  const today = new Date().toISOString().slice(0, 10);

  const [activeConflicts, blogPosts, losses] = await Promise.all([
    getCollectionCount('war-conflicts', {
      filters: {
        $or: [
          { endDate: { $null: true } },
          { endDate: { $gte: today } },
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

  return { verifiedLosses, activeConflicts, blogPosts };
}

export async function getHomePageAnalytics(
  locale?: AppLocale,
): Promise<HomePageAnalytics> {
  const today = new Date().toISOString().slice(0, 10);

  const [activeConflicts, blogPosts, losses] = await Promise.all([
    getCollectionCount('war-conflicts', {
      filters: {
        $or: [
          { endDate: { $null: true } },
          { endDate: { $gte: today } },
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

  const lossAnalytics = buildLossAnalytics(losses);

  return {
    heroStats: {
      verifiedLosses: lossAnalytics.verifiedLosses,
      activeConflicts,
      blogPosts,
    },
    timeline: lossAnalytics.timeline,
    categories: lossAnalytics.categories,
  };
}

export async function getConflictAnalyticsSectionData(
  requestedConflictSlug?: string,
): Promise<ConflictAnalyticsSectionData> {
  const conflicts = await findAllCollection<StrapiWarConflict>(
    'war-conflicts',
    { sort: ['startDate:desc', 'name:asc'] },
  ).then((documents) => documents.map(mapWarConflict));

  const selectedConflict = resolveSelectedConflict(conflicts, requestedConflictSlug);

  if (!selectedConflict) {
    return { conflicts: [], selectedConflict: null, timeline: [], categories: [] };
  }

  const losses = await findAllCollection<StrapiDestroyedEquipment>(
    'destroyed-equipments',
    {
      populate: HOME_PAGE_ANALYTICS_POPULATE,
      sort: ['reportedAt:asc', 'sourceRecordId:asc'],
      filters: { warConflict: { slug: { $eq: selectedConflict.slug } } },
    },
  ).then((documents) => documents.map(mapDestroyedEquipment));

  const lossAnalytics = buildLossAnalytics(losses);

  return {
    conflicts,
    selectedConflict,
    timeline: lossAnalytics.timeline,
    categories: lossAnalytics.categories,
  };
}

export async function getBlogPostsPreview(
  locale?: AppLocale,
): Promise<{ posts: BlogPost[]; total: number }> {
  const response = await findCollection<StrapiBlogPost>('blog-posts', {
    ...(locale ? { locale } : {}),
    populate: BLOG_POST_POPULATE,
    sort: ['publishedAt:desc'],
    pagination: { page: 1, pageSize: 3, withCount: true },
    status: 'published',
  });
  return {
    posts: response.data.map(mapBlogPost),
    total: response.meta.pagination?.total ?? 0,
  };
}

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
    pagination: { page, pageSize, withCount: true },
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
    filters: { slug: { $eq: slug } },
    pagination: { page: 1, pageSize: 1 },
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
      pagination: { page: 1, pageSize: 100 },
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
      pagination: { page: 1, pageSize },
    },
  );

  return response.data.map(mapDestroyedEquipment);
}

export async function getWarConflicts(): Promise<WarConflict[]> {
  const conflicts = await findAllCollection<StrapiWarConflict>(
    'war-conflicts',
    { sort: ['startDate:desc', 'name:asc'] },
  );
  return conflicts.map(mapWarConflict);
}

export interface MapDataOptions {
  conflictSlug: string;
  equipmentTypeSlugs?: string[];
  countrySlugs?: string[];
  statusSlugs?: string[];
}

export interface MapData {
  equipment: DestroyedEquipment[];
  events: ConflictEvent[];
  availableEquipmentTypes: Array<{ name: string; slug: string }>;
  availableCountries: Array<{ name: string; slug: string; code: string }>;
  availableStatuses: Array<{ name: string; slug: string }>;
}

export async function getMapData(options: MapDataOptions): Promise<MapData> {
  const { conflictSlug, equipmentTypeSlugs, countrySlugs, statusSlugs } = options;

  const equipmentFilters: Record<string, unknown> = {
    warConflict: { slug: { $eq: conflictSlug } },
    latitude: { $notNull: true },
    longitude: { $notNull: true },
  };

  if (equipmentTypeSlugs?.length) {
    equipmentFilters.equipment = { type: { slug: { $in: equipmentTypeSlugs } } };
  }

  if (countrySlugs?.length) {
    equipmentFilters.country = { slug: { $in: countrySlugs } };
  }

  if (statusSlugs?.length) {
    equipmentFilters.status = { slug: { $in: statusSlugs } };
  }

  const MAP_EQUIPMENT_POPULATE = {
    country: true,
    destroyedBy: true,
    equipment: { populate: { originCountry: true, type: true } },
    region: true,
    status: true,
    warConflict: true,
  } as const;

  const [allEquipment, events] = await Promise.all([
    findAllCollection<StrapiDestroyedEquipment>('destroyed-equipments', {
      populate: MAP_EQUIPMENT_POPULATE,
      filters: equipmentFilters,
      sort: ['reportedAt:desc'],
    }).then((docs) => docs.map(mapDestroyedEquipment)),
    findAllCollection<StrapiConflictEvent>('conflict-events', {
      populate: { warConflict: true },
      filters: { warConflict: { slug: { $eq: conflictSlug } } },
      sort: ['date:desc'],
    }).then((docs) => docs.map(mapConflictEvent)),
  ]);

  const typeMap = new Map<string, { name: string; slug: string }>();
  const countryMap = new Map<string, { name: string; slug: string; code: string }>();
  const statusMap = new Map<string, { name: string; slug: string }>();

  for (const eq of allEquipment) {
    if (eq.equipment?.type) {
      typeMap.set(eq.equipment.type.slug, { name: eq.equipment.type.name, slug: eq.equipment.type.slug });
    }
    if (eq.country) {
      countryMap.set(eq.country.slug, { name: eq.country.name, slug: eq.country.slug, code: eq.country.code });
    }
    if (eq.status) {
      statusMap.set(eq.status.slug, { name: eq.status.name, slug: eq.status.slug });
    }
  }

  return {
    equipment: allEquipment,
    events,
    availableEquipmentTypes: Array.from(typeMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    availableCountries: Array.from(countryMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    availableStatuses: Array.from(statusMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export interface AnalyticsLossesOptions {
  conflictSlug: string;
  page?: number;
  pageSize?: number;
  statusSlug?: string;
  equipmentTypeSlug?: string;
  countrySlug?: string;
  model?: string;
  inscription?: string;
  regionSlug?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function getAnalyticsPageData(
  requestedConflictSlug?: string,
): Promise<AnalyticsPageData> {
  const [conflicts, allEquipmentTypes] = await Promise.all([
    findAllCollection<StrapiWarConflict>('war-conflicts', {
      sort: ['startDate:desc', 'name:asc'],
    }).then((docs) => docs.map(mapWarConflict)),
    findAllCollection<StrapiEquipmentType>('equipment-types', {
      populate: { previewSvg: true },
      sort: ['name:asc'],
    }).then((docs) => docs.map(mapEquipmentType)),
  ]);

  const selectedConflict = resolveSelectedConflict(conflicts, requestedConflictSlug);

  if (!selectedConflict) {
    return {
      conflicts,
      selectedConflict: null,
      timeline: [],
      categories: [],
      tiles: [],
      total: 0,
      totalByStatus: createEmptyStatusTotals(),
    };
  }

  const losses = await findAllCollection<StrapiDestroyedEquipment>(
    'destroyed-equipments',
    {
      populate: HOME_PAGE_ANALYTICS_POPULATE,
      sort: ['reportedAt:asc', 'sourceRecordId:asc'],
      filters: { warConflict: { slug: { $eq: selectedConflict.slug } } },
    },
  ).then((docs) => docs.map(mapDestroyedEquipment));

  const lossAnalytics = buildLossAnalytics(losses, Infinity);

  const svgBySlug = new Map(allEquipmentTypes.map((t) => [t.slug, t.previewSvgUrl]));
  const tiles: AnalyticsEquipmentTile[] = lossAnalytics.categories.map((cat) => ({
    ...cat,
    previewSvgUrl: svgBySlug.get(cat.slug) ?? null,
  }));

  const totalByStatus = createEmptyStatusTotals();
  for (const loss of losses) {
    const statusKey = asTrackedStatusKey(loss.status?.slug);
    const quantity = Number.isFinite(loss.quantity) && loss.quantity > 0 ? loss.quantity : 1;
    if (statusKey) totalByStatus[statusKey] += quantity;
  }

  return {
    conflicts,
    selectedConflict,
    timeline: lossAnalytics.timeline,
    categories: lossAnalytics.categories,
    tiles,
    total: lossAnalytics.verifiedLosses,
    totalByStatus,
  };
}

export async function getAnalyticsLosses(
  options: AnalyticsLossesOptions,
): Promise<AnalyticsLossesResult> {
  const {
    conflictSlug,
    page = 1,
    pageSize = 25,
    statusSlug,
    equipmentTypeSlug,
    countrySlug,
    model,
    inscription,
    regionSlug,
    dateFrom,
    dateTo,
  } = options;

  const filters: Record<string, unknown> = {
    warConflict: { slug: { $eq: conflictSlug } },
  };

  if (statusSlug) filters.status = { slug: { $eq: statusSlug } };

  const equipmentFilter: Record<string, unknown> = {};
  if (equipmentTypeSlug) equipmentFilter.type = { slug: { $eq: equipmentTypeSlug } };
  if (model) equipmentFilter.name = { $containsi: model };
  if (Object.keys(equipmentFilter).length > 0) filters.equipment = equipmentFilter;

  if (countrySlug) filters.country = { slug: { $eq: countrySlug } };
  if (inscription) filters.equipmentLabel = { $containsi: inscription };
  if (regionSlug) filters.region = { slug: { $eq: regionSlug } };

  const dateFilter: Record<string, string> = {};
  if (dateFrom) dateFilter.$gte = dateFrom;
  if (dateTo) dateFilter.$lte = dateTo;
  if (Object.keys(dateFilter).length > 0) filters.eventDate = dateFilter;

  const response = await findCollection<StrapiDestroyedEquipment>(
    'destroyed-equipments',
    {
      populate: DESTROYED_EQUIPMENT_POPULATE,
      filters,
      sort: ['reportedAt:desc', 'sourceRecordId:desc'],
      pagination: { page, pageSize, withCount: true },
    },
  );

  return {
    losses: response.data.map(mapDestroyedEquipment),
    total: response.meta.pagination?.total ?? 0,
  };
}

export async function getLossById(
  documentId: string,
): Promise<DestroyedEquipment | null> {
  const response = await findCollection<StrapiDestroyedEquipment>(
    'destroyed-equipments',
    {
      populate: DESTROYED_EQUIPMENT_POPULATE,
      filters: { documentId: { $eq: documentId } },
      pagination: { page: 1, pageSize: 1 },
    },
  );

  const [loss] = response.data;
  return loss ? mapDestroyedEquipment(loss) : null;
}

export async function getRegions(): Promise<Array<{ name: string; slug: string }>> {
  const docs = await findAllCollection<{
    id: number;
    documentId: string;
    name?: string | null;
    slug?: string | null;
  }>('regions', { sort: ['name:asc'] });

  return docs
    .map((e) => ({ name: e.name ?? '', slug: e.slug ?? '' }))
    .filter((e) => e.name && e.slug);
}

export async function getEquipmentList(
  typeSlug?: string,
): Promise<Array<{ name: string; slug: string }>> {
  const docs = await findAllCollection<{
    id: number;
    documentId: string;
    name?: string | null;
    slug?: string | null;
  }>('equipments', {
    sort: ['name:asc'],
    ...(typeSlug ? { filters: { type: { slug: { $eq: typeSlug } } } } : {}),
  });

  return docs
    .map((e) => ({ name: e.name ?? '', slug: e.slug ?? '' }))
    .filter((e) => e.name && e.slug);
}

export type {
  AnalyticsEquipmentTile,
  AnalyticsLossesResult,
  AnalyticsPageData,
  BlogPost,
  BlogPostCategory,
  BlogPostContent,
  ConflictAnalyticsSectionData,
  ConflictEvent,
  DestroyedEquipment,
  EquipmentType,
  HomeCategoryStats,
  HomeHeroStats,
  HomePageAnalytics,
  HomeTimelinePoint,
  LossStatusKey,
  ReadTimeBucket,
  WarConflict,
} from './types';
