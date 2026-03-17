'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Crosshair,
  FileText,
  MapPin,
  Search,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const platformItems = [
  {
    key: 'lossPages',
    icon: Crosshair,
    color: 'from-chart-1/20 to-transparent',
    iconColor: 'text-chart-1',
  },
  {
    key: 'searchFilters',
    icon: Search,
    color: 'from-chart-2/20 to-transparent',
    iconColor: 'text-chart-2',
  },
  {
    key: 'analyticsBlog',
    icon: FileText,
    color: 'from-chart-3/20 to-transparent',
    iconColor: 'text-chart-3',
  },
  {
    key: 'conflictMaps',
    icon: MapPin,
    color: 'from-chart-4/20 to-transparent',
    iconColor: 'text-chart-4',
  },
  {
    key: 'dashboards',
    icon: BarChart3,
    color: 'from-chart-5/20 to-transparent',
    iconColor: 'text-chart-5',
  },
  {
    key: 'trends',
    icon: TrendingUp,
    color: 'from-chart-1/20 to-transparent',
    iconColor: 'text-chart-1',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function PlatformCards() {
  const t = useTranslations('Platform');

  return (
    <section className="py-10">
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
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {platformItems.map(({ key, icon: Icon, color, iconColor }) => (
          <motion.div key={key} variants={itemVariants}>
            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80 h-full">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <CardContent className="relative p-6">
                <Icon className={`h-8 w-8 ${iconColor} mb-4`} />
                <h3 className="font-semibold text-lg mb-2">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`${key}.description`)}
                </p>
                <div className="mt-4 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                  {t(`${key}.tag`)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
