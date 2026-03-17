'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart3,
  Map,
  Search,
  TrendingUp,
  Shield,
  Layers,
} from 'lucide-react';

const features = [
  {
    key: 'liveTracking',
    icon: TrendingUp,
    color: 'text-chart-1',
    bg: 'bg-chart-1/10',
    accent: 'border-chart-1/20',
  },
  {
    key: 'interactiveMaps',
    icon: Map,
    color: 'text-chart-2',
    bg: 'bg-chart-2/10',
    accent: 'border-chart-2/20',
  },
  {
    key: 'deepAnalytics',
    icon: BarChart3,
    color: 'text-chart-3',
    bg: 'bg-chart-3/10',
    accent: 'border-chart-3/20',
  },
  {
    key: 'advancedSearch',
    icon: Search,
    color: 'text-chart-4',
    bg: 'bg-chart-4/10',
    accent: 'border-chart-4/20',
  },
  {
    key: 'verifiedData',
    icon: Shield,
    color: 'text-chart-5',
    bg: 'bg-chart-5/10',
    accent: 'border-chart-5/20',
  },
  {
    key: 'categoryBreakdown',
    icon: Layers,
    color: 'text-chart-1',
    bg: 'bg-chart-1/10',
    accent: 'border-chart-1/20',
  },
];

export function FeatureCarousel() {
  const t = useTranslations('Features');

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t('sectionTitle')}
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          {t('sectionDescription')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {features.map(({ key, icon: Icon, color, bg, accent }) => (
              <CarouselItem
                key={key}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card
                  className={`border ${accent} bg-card/50 backdrop-blur-sm h-full transition-colors hover:bg-card/80`}
                >
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div
                      className={`${bg} ${color} w-12 h-12 rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {t(`${key}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {t(`${key}.description`)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 md:-left-12" />
          <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
      </motion.div>
    </section>
  );
}
