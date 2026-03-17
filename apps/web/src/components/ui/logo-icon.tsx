import { Crosshair, type LucideProps } from 'lucide-react';

import { cn } from '@/lib/utils';

export function LogoIcon({ className, ...props }: LucideProps) {
  return <Crosshair className={cn('text-chart-1', className)} {...props} />;
}
