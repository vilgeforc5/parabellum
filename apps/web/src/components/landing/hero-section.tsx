'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Crosshair } from 'lucide-react';
import { useTranslations } from 'next-intl';

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-[10%] top-12 h-130 rounded-full bg-chart-1/8 blur-[140px]" />
      <div className="absolute left-[8%] top-[22%] h-70 w-70 rounded-full bg-chart-1/10 blur-[90px]" />
      <div className="absolute right-[10%] top-[14%] h-90 w-90 rounded-full bg-chart-2/10 blur-[110px]" />
    </div>
  );
}

function FloatingStats() {
  const stats = [
    { value: '14,200+', label: 'Verified Losses' },
    { value: '8', label: 'Active Conflicts' },
    { value: '47', label: 'Countries' },
  ];

  return (
    <div className="mt-10 flex flex-wrap gap-4 md:gap-5">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="w-full md:w-56 rounded-2xl border border-border/60 bg-card/65 px-5 py-4 text-left shadow-sm backdrop-blur-sm"
        >
          <div className="text-2xl font-bold text-foreground md:text-3xl">
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  const t = useTranslations('HomePage');

  return (
    <section className="relative -mx-4 -mt-6 flex min-h-[85vh] items-center overflow-hidden px-4">
      <GridBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl py-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-4 py-1.5 text-sm text-chart-1 shadow-sm backdrop-blur-md">
          <Crosshair className="h-3.5 w-3.5" />
          <span>{t('heroBadge')}</span>
        </div>

        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          {t('heroTitle')}
          <span className="block bg-gradient-to-r from-chart-1 via-chart-1 to-chart-1/70 bg-clip-text text-transparent">
            {t('heroTitleAccent')}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {t('heroDescription')}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button size="lg" asChild className="gap-2">
            <Link href="/analytics">
              {t('heroCTA')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/analytics/map">{t('heroMapCTA')}</Link>
          </Button>
        </div>

        <FloatingStats />
      </div>
    </section>
  );
}
