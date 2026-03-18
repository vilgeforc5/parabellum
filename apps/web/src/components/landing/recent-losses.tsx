'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/status-badge';
import type { DestroyedEquipment } from '@/lib/strapi';

interface RecentLossesProps {
  losses: DestroyedEquipment[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

function formatDate(value: string | null, locale: string) {
  if (!value) {
    return 'Unknown date';
  }

  try {
    const parts = value.split('-').map((part) => Number.parseInt(part, 10));

    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
      return value;
    }

    const [year, month, day] = parts;

    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)));
  } catch {
    return value;
  }
}

export function RecentLosses({ losses }: RecentLossesProps) {
  const t = useTranslations('HomePage');
  const locale = useLocale();

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
        {losses.map((loss) => (
          <motion.div key={loss.id} variants={itemVariants}>
            <Card className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80 cursor-pointer">
              <div className="relative h-36 overflow-hidden rounded-t-xl bg-gradient-to-br from-secondary to-background">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:4px_4px]" />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={loss.status?.slug ?? 'unknown'} />
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="text-xs">
                    {loss.equipment?.type?.name ??
                      loss.destroyedBy[0]?.name ??
                      loss.region?.name ??
                      loss.warConflict?.name ??
                      'Unspecified'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold group-hover:text-chart-1 transition-colors">
                    {loss.equipment?.name ?? 'Unknown equipment'}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(loss.reportedAt, locale)}
                  </span>
                </div>
                {loss.equipmentModification ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {loss.equipmentModification}
                  </p>
                ) : null}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span className="inline-block w-4 h-3 rounded-sm bg-muted" />
                  {[loss.country?.code ?? 'NA', loss.region?.name ?? 'Unknown region'].join(
                    ' / '
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
