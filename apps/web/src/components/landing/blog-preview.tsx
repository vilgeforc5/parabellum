'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { BlogPost } from '@/lib/strapi';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface BlogPreviewProps {
  posts: BlogPost[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  const t = useTranslations('Blog');

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('sectionTitle')}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl">
            {t('sectionDescription')}
          </p>
        </div>
        <Button variant="ghost" asChild className="hidden md:flex gap-2">
          <Link href="/blog">
            {t('viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-3"
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={itemVariants}>
            <Link href={`/blog/${post.slug}`}>
              <Card className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary h-full flex flex-col cursor-pointer">
                <div className="relative h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-secondary to-background">
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                        <Tag className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  {post.category && (
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="outline"
                        className="text-chart-1 border-primary/30 bg-chart-1/10 text-xs font-medium"
                      >
                        {post.category.name}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
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
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-6 text-center md:hidden">
        <Button variant="outline" asChild className="gap-2">
          <Link href="/blog">
            {t('viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
