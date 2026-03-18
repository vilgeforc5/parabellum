import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { BlogFilters } from '@/components/blog/blog-filters';
import {
  getBlogPosts,
  getBlogPostCategories,
  type ReadTimeBucket,
} from '@/lib/strapi';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; readTime?: string }>;
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { category, readTime } = await searchParams;
  const t = await getTranslations('BlogPage');

  const validReadTime = (['short', 'medium', 'long'] as ReadTimeBucket[]).includes(
    readTime as ReadTimeBucket
  )
    ? (readTime as ReadTimeBucket)
    : undefined;

  const [{ posts }, categories] = await Promise.all([
    getBlogPosts({
      pageSize: 20,
      categorySlug: category,
      readTimeBucket: validReadTime,
    }).catch(() => ({ posts: [] })),
    getBlogPostCategories().catch(() => []),
  ]);

  return (
    <section className="mx-auto w-full max-w-6xl py-10">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-chart-1">
          {t('eyebrow')}
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          {t('title')}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <div className="mb-8">
        <BlogFilters
          categories={categories}
          activeCategory={category}
          activeReadTime={validReadTime}
        />
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium">{t('noPosts')}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t('noPostsHint')}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="group h-full flex flex-col border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary cursor-pointer">
                <div className="relative h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-secondary to-background">
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                        <Tag className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  {post.category && (
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="outline"
                        className="bg-chart-1/10 text-chart-1 border-primary/30 text-xs font-medium"
                      >
                        {post.category.name}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="flex flex-1 flex-col p-5">
                  <h2 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.publishedAt.slice(0, 10)}
                      </span>
                    )}
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {t('readTime', { minutes: post.readTime })}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
