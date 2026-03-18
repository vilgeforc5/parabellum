import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { BlocksRenderer } from '@/components/blog/blocks-renderer';
import { getBlogPost } from '@/lib/strapi';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('BlogPage');

  const post = await getBlogPost(slug, locale as AppLocale).catch(() => null);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl py-10">
      <div className="mb-8">
        <Button
          variant="ghost"
          asChild
          className="-ml-3 gap-2 text-muted-foreground"
        >
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4" />
            {t('backToBlog')}
          </Link>
        </Button>
      </div>

      {post.coverImageUrl && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      <header className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {post.category && (
            <Badge
              variant="outline"
              className="bg-chart-1/10 text-chart-1 border-primary/30"
            >
              {post.category.name}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {post.title}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {t('readTime', { minutes: post.readTime })}
            </span>
          )}
        </div>
      </header>

      <div className="pt-8">
        <BlocksRenderer content={post.content} />
      </div>
    </article>
  );
}
