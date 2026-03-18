const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

async function strapiGet(path: string, params?: Record<string, string>) {
  const url = new URL(`/api${path}`, BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Strapi ${res.status} ${url.pathname}`);
  return res.json();
}

export type ReadTimeBucket = 'short' | 'medium' | 'long';

export async function getBlogPosts(options?: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  readTimeBucket?: ReadTimeBucket;
}) {
  const { page = 1, pageSize = 10, categorySlug, readTimeBucket } = options ?? {};

  const params: Record<string, string> = {
    'populate[coverImage]': '*',
    'populate[tags]': '*',
    'populate[category]': '*',
    sort: 'publishedAt:desc',
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
    publicationState: 'live',
  };

  if (categorySlug) params['filters[category][slug][$eq]'] = categorySlug;
  if (readTimeBucket === 'short') params['filters[readTime][$lte]'] = '5';
  if (readTimeBucket === 'medium') {
    params['filters[readTime][$gte]'] = '6';
    params['filters[readTime][$lte]'] = '15';
  }
  if (readTimeBucket === 'long') params['filters[readTime][$gte]'] = '16';

  const json = await strapiGet('/blog-posts', params);
  const posts = (json.data ?? []).map(mapPost);
  return { posts, total: json.meta?.pagination?.total ?? 0 };
}

export async function getBlogPost(slug: string) {
  const json = await strapiGet('/blog-posts', {
    'filters[slug][$eq]': slug,
    'populate[coverImage]': '*',
    'populate[tags]': '*',
    'populate[category]': '*',
    publicationState: 'live',
  });
  if (!json.data?.length) return null;
  return mapPost(json.data[0]);
}

export async function getBlogPostCategories() {
  const json = await strapiGet('/blog-post-categories', {
    'pagination[pageSize]': '100',
    sort: 'name:asc',
  });
  return (json.data ?? []).map(mapCategory);
}

// ─── Mappers ───

function mapCategory(raw: any) {
  return {
    id: raw.id as number,
    name: raw.name as string,
    slug: raw.slug as string,
    description: (raw.description ?? null) as string | null,
  };
}

function mapPost(raw: any) {
  const cover: string | null = raw.coverImage?.url ?? null;
  return {
    id: raw.id as number,
    title: raw.title as string,
    slug: raw.slug as string,
    excerpt: raw.excerpt as string,
    content: raw.content ?? null,
    coverImageUrl: cover ? (cover.startsWith('http') ? cover : `${BASE_URL}${cover}`) : null,
    readTime: (raw.readTime ?? null) as number | null,
    author: (raw.author ?? null) as string | null,
    category: raw.category ? mapCategory(raw.category) : null,
    tags: ((raw.tags ?? []) as any[]).map((t) => ({ id: t.id as number, name: t.name as string, slug: t.slug as string })),
    publishedAt: (raw.publishedAt ?? null) as string | null,
  };
}

export type BlogPost = ReturnType<typeof mapPost>;
export type BlogPostCategory = ReturnType<typeof mapCategory>;
