import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LossStatus } from '@parabellum/contracts';

const statusConfig: Record<
  LossStatus,
  { label: string; className: string }
> = {
  destroyed: {
    label: 'Destroyed',
    className: 'bg-red-900/50 text-red-300 border-red-800',
  },
  damaged: {
    label: 'Damaged',
    className: 'bg-orange-900/50 text-orange-300 border-orange-800',
  },
  captured: {
    label: 'Captured',
    className: 'bg-blue-900/50 text-blue-300 border-blue-800',
  },
  abandoned: {
    label: 'Abandoned',
    className: 'bg-zinc-800/50 text-zinc-300 border-zinc-700',
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
