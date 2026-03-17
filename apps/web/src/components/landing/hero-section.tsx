'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Crosshair } from 'lucide-react';
import { useTranslations } from 'next-intl';

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-chart-1/5 blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-chart-2/5 blur-[100px]" />
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
    <div className="flex flex-wrap gap-8 mt-10">
      {stats.map((stat, i) => (
        <div key={i} className="text-left">
          <div className="text-2xl md:text-3xl font-bold text-foreground">
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
    <section className="relative min-h-[85vh] flex items-center -mx-4 -mt-6 px-4">
      <GridBackground />

      <div className="relative z-10 max-w-6xl mx-auto w-full py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-chart-1/30 bg-chart-1/10 px-4 py-1.5 text-sm text-chart-1 mb-6">
          <Crosshair className="h-3.5 w-3.5" />
          <span>{t('heroBadge')}</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
          {t('heroTitle')}
          <span className="block text-chart-1">{t('heroTitleAccent')}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
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
