import * as React from 'react';

import { cn } from '@/lib/utils';

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'mx-auto flex w-full max-w-3xl flex-col items-center rounded-[2rem] border border-border/70 bg-card p-6 text-center shadow-sm sm:p-10',
        className,
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn('flex flex-col items-center gap-4', className)}
      {...props}
    />
  );
}

function EmptyMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-media"
      className={cn(
        'flex min-h-24 min-w-24 items-center justify-center rounded-[1.5rem] border border-border/60 bg-muted px-6 text-center text-3xl font-semibold tracking-[0.35em] text-chart-1 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      data-slot="empty-title"
      className={cn(
        'text-3xl font-semibold tracking-tight sm:text-4xl',
        className,
      )}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        'max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base',
        className,
      )}
      {...props}
    />
  );
}

function EmptyFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-footer"
      className={cn(
        'mt-8 flex flex-wrap items-center justify-center gap-3',
        className,
      )}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyDescription,
  EmptyFooter,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};
