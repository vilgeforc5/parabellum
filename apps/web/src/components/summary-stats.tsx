'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, ShieldAlert, Flag, Clock } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  iconClassName?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon
          className={`h-4 w-4 ${iconClassName ?? 'text-muted-foreground'}`}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface SummaryStatsProps {
  totalLosses: number;
  destroyed: number;
  captured: number;
  last24h: number;
}

export function SummaryStats({
  totalLosses,
  destroyed,
  captured,
  last24h,
}: SummaryStatsProps) {
  const t = useTranslations('Stats');
  const locale = useLocale();

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t('totalVerifiedLosses')}
        value={totalLosses.toLocaleString(locale)}
        icon={ShieldAlert}
        iconClassName="text-chart-1"
      />
      <StatCard
        title={t('destroyed')}
        value={destroyed.toLocaleString(locale)}
        icon={Flame}
        iconClassName="text-red-400"
      />
      <StatCard
        title={t('captured')}
        value={captured.toLocaleString(locale)}
        icon={Flag}
        iconClassName="text-blue-400"
      />
      <StatCard
        title={t('last24Hours')}
        value={last24h.toLocaleString(locale)}
        subtitle={t('newlyVerified')}
        icon={Clock}
        iconClassName="text-green-400"
      />
    </div>
  );
}
