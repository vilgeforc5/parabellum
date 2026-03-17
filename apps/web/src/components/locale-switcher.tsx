'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useTopLoader } from 'nextjs-toploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';

const supportedLocales: AppLocale[] = ['en', 'ru'];

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations('LocaleSwitcher');
  const router = useRouter();
  const pathname = usePathname();
  const loader = useTopLoader();
  const [isPending, startTransition] = useTransition();

  const localeMeta = supportedLocales.map((value) => ({
    value,
    countryCode: t(`locales.${value}.countryCode`),
    countryName: t(`locales.${value}.countryName`),
    flag: t(`locales.${value}.flag`),
  }));

  const currentLocale =
    localeMeta.find(({ value }) => value === locale) ?? localeMeta[0];

  function onValueChange(nextLocale: string) {
    const targetLocale = nextLocale as AppLocale;

    if (targetLocale === locale) {
      return;
    }

    startTransition(() => {
      loader.start();
      router.replace(pathname, { locale: targetLocale });
    });
  }

  return (
    <Select
      aria-label={t('label')}
      defaultValue={locale}
      disabled={isPending}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-[88px] justify-end gap-2 border-border/70 bg-background/70 px-2.5 font-medium uppercase shadow-sm backdrop-blur-sm">
        <span aria-hidden className="text-base leading-none">
          {currentLocale.flag}
        </span>
        <span>{currentLocale.countryCode}</span>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[12rem]">
        {localeMeta.map(({ value, flag, countryCode, countryName }) => (
          <SelectItem key={value} value={value}>
            <span className="flex items-center gap-2">
              <span aria-hidden className="text-base leading-none">
                {flag}
              </span>
              <span className="font-medium uppercase text-foreground/70">
                {countryCode}
              </span>
              <span>{countryName}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
