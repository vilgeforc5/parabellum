'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/status-badge';

interface MockLoss {
  id: number;
  name: string;
  category: string;
  status: string;
  country: string;
  date: string;
}

const mockLosses: MockLoss[] = [
  {
    id: 1,
    name: 'T-72B3',
    category: 'Tanks',
    status: 'destroyed',
    country: 'RU',
    date: '2026-03-16',
  },
  {
    id: 2,
    name: 'BMP-2',
    category: 'APCs/IFVs',
    status: 'captured',
    country: 'RU',
    date: '2026-03-16',
  },
  {
    id: 3,
    name: 'Msta-S',
    category: 'Artillery',
    status: 'destroyed',
    country: 'RU',
    date: '2026-03-15',
  },
  {
    id: 4,
    name: 'Pantsir-S1',
    category: 'SAM Systems',
    status: 'damaged',
    country: 'RU',
    date: '2026-03-15',
  },
  {
    id: 5,
    name: 'Ka-52',
    category: 'Aircraft',
    status: 'destroyed',
    country: 'RU',
    date: '2026-03-14',
  },
  {
    id: 6,
    name: 'Orlan-10',
    category: 'UAVs',
    status: 'destroyed',
    country: 'RU',
    date: '2026-03-14',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export function RecentLosses() {
  const t = useTranslations('HomePage');

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t('recentTitle')}
        </h2>
        <p className="mt-2 text-muted-foreground">{t('recentHint')}</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {mockLosses.map((loss) => (
          <motion.div key={loss.id} variants={itemVariants}>
            <Card className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80 cursor-pointer">
              {/* Image placeholder */}
              <div className="relative h-36 overflow-hidden rounded-t-xl bg-gradient-to-br from-secondary to-background">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:4px_4px]" />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={loss.status} />
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="text-xs">
                    {loss.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold group-hover:text-chart-1 transition-colors">
                    {loss.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {loss.date}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span className="inline-block w-4 h-3 rounded-sm bg-muted" />
                  {loss.country}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
