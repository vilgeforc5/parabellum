'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

const mockPosts = [
  {
    key: 'post1',
    tag: 'analysis',
    tagColor: 'text-chart-1 border-chart-1/30 bg-chart-1/10',
    readTime: '12',
    date: '2026-03-14',
    accentBorder: 'hover:border-chart-1/40',
  },
  {
    key: 'post2',
    tag: 'osint',
    tagColor: 'text-chart-2 border-chart-2/30 bg-chart-2/10',
    readTime: '8',
    date: '2026-03-10',
    accentBorder: 'hover:border-chart-2/40',
  },
  {
    key: 'post3',
    tag: 'trends',
    tagColor: 'text-chart-3 border-chart-3/30 bg-chart-3/10',
    readTime: '15',
    date: '2026-03-06',
    accentBorder: 'hover:border-chart-3/40',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function BlogPreview() {
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
        {mockPosts.map(({ key, tag, tagColor, readTime, date, accentBorder }) => (
          <motion.div key={key} variants={itemVariants}>
            <Card
              className={`group border-border/50 bg-card/50 backdrop-blur-sm transition-all ${accentBorder} h-full flex flex-col`}
            >
              {/* Image placeholder with gradient */}
              <div className="relative h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-secondary to-background">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                    <Tag className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="outline"
                    className={`${tagColor} text-xs font-medium`}
                  >
                    {t(`tags.${tag}`)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-lg leading-snug group-hover:text-chart-1 transition-colors">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1">
                  {t(`${key}.excerpt`)}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {t('readTime', { minutes: readTime })}
                  </span>
                </div>
              </CardContent>
            </Card>
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
