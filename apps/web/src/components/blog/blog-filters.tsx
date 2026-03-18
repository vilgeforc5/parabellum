'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BlogPostCategory, ReadTimeBucket } from '@/lib/strapi';

interface BlogFiltersProps {
  categories: BlogPostCategory[];
  activeCategory: string | undefined;
  activeReadTime: ReadTimeBucket | undefined;
}

const READ_TIME_BUCKETS: { value: ReadTimeBucket; labelKey: string }[] = [
  { value: 'short', labelKey: 'readTimeShort' },
  { value: 'medium', labelKey: 'readTimeMedium' },
  { value: 'long', labelKey: 'readTimeLong' },
];

export function BlogFilters({
  categories,
  activeCategory,
  activeReadTime,
}: BlogFiltersProps) {
  const t = useTranslations('BlogPage');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const hasFilters = !!activeCategory || !!activeReadTime;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={activeCategory ?? ''}
        onValueChange={(v) => updateParam('category', v || null)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder={t('allCategories')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">{t('allCategories')}</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        {READ_TIME_BUCKETS.map(({ value, labelKey }) => (
          <button
            key={value}
            onClick={() =>
              updateParam('readTime', activeReadTime === value ? null : value)
            }
            className="focus:outline-none"
          >
            <Badge
              variant={activeReadTime === value ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors select-none"
            >
              {t(labelKey as Parameters<typeof t>[0])}
            </Badge>
          </button>
        ))}
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          onClick={() => router.push(pathname)}
        >
          <X className="h-3 w-3" />
          {t('clearFilters')}
        </Button>
      )}
    </div>
  );
}
