'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { LogoIcon } from '@/components/ui/logo-icon';

export function Footer() {
  const t = useTranslations('Navigation');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/80">
      <div className="container mx-auto flex flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-80"
        >
          <LogoIcon className="h-4 w-4" />
          <span>{t('brand')}</span>
        </Link>

        <p>{year}</p>
      </div>
    </footer>
  );
}
