'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
        <Icon className={`h-4 w-4 ${iconClassName ?? 'text-muted-foreground'}`} />
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
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Verified Losses"
        value={totalLosses.toLocaleString()}
        icon={ShieldAlert}
        iconClassName="text-chart-1"
      />
      <StatCard
        title="Destroyed"
        value={destroyed.toLocaleString()}
        icon={Flame}
        iconClassName="text-red-400"
      />
      <StatCard
        title="Captured"
        value={captured.toLocaleString()}
        icon={Flag}
        iconClassName="text-blue-400"
      />
      <StatCard
        title="Last 24 Hours"
        value={last24h.toLocaleString()}
        subtitle="newly verified"
        icon={Clock}
        iconClassName="text-green-400"
      />
    </div>
  );
}
