import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LossStatus } from '@parabellum/contracts';

const statusConfig: Record<LossStatus, { label: string; className: string }> = {
  destroyed: {
    label: 'Destroyed',
    className:
      'border-red-200 bg-red-500/10 text-red-700 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300',
  },
  damaged: {
    label: 'Damaged',
    className:
      'border-orange-200 bg-orange-500/10 text-orange-700 dark:border-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  },
  captured: {
    label: 'Captured',
    className:
      'border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  },
  abandoned: {
    label: 'Abandoned',
    className:
      'border-zinc-200 bg-zinc-500/10 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300',
  },
};

export function StatusBadge({ status }: { status: LossStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn(config.className)}>
      {config.label}
    </Badge>
  );
}
