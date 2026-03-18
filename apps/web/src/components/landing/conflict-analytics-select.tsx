'use client';

import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { WarConflict } from '@/lib/strapi';

interface ConflictAnalyticsSelectProps {
  conflicts: WarConflict[];
  selectedConflictSlug: string | null;
  label: string;
  placeholder: string;
}

export function ConflictAnalyticsSelect({
  conflicts,
  selectedConflictSlug,
  label,
  placeholder,
}: ConflictAnalyticsSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleValueChange(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('conflict', nextValue);

    startTransition(() => {
      router.replace(
        params.size > 0 ? `${pathname}?${params.toString()}` : pathname,
        { scroll: false },
      );
    });
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <Select
        value={selectedConflictSlug ?? undefined}
        onValueChange={handleValueChange}
        disabled={conflicts.length === 0 || isPending}
      >
        <SelectTrigger className="w-full min-w-0 sm:w-80">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {conflicts.map((conflict) => (
            <SelectItem key={conflict.documentId} value={conflict.slug}>
              {conflict.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
