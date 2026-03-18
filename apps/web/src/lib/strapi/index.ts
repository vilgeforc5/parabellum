import type { API } from '@strapi/client';
import type { AppLocale } from '@/i18n/routing';
import { strapiClient } from './client';
import { mapBlogPost, mapBlogPostCategory } from './mappers';
import type {
  BlogPost,
  BlogPostCategory,
  ReadTimeBucket,
  StrapiBlogPost,
  StrapiBlogPostCategory,
} from './types';

const BLOG_POST_POPULATE = {
  coverImage: true,
  category: true,
} as const;

type CollectionResponse<TDocument> = Omit<API.DocumentResponseCollection, 'data'> & {
  data: TDocument[];
};

function blogPostFilters(
  categorySlug?: string,
  readTimeBucket?: ReadTimeBucket
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
  query?: API.BaseQueryParams
) : Promise<CollectionResponse<TDocument>> {
  return (await strapiClient.collection(resource).find(
    query
  )) as CollectionResponse<TDocument>;
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
  locale?: AppLocale
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
  locale?: AppLocale
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
    }
  );

  return response.data.map(mapBlogPostCategory);
}

export type {
  BlogPost,
  BlogPostCategory,
  BlogPostContent,
  ReadTimeBucket,
} from './types';
