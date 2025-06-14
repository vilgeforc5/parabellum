'use client';

import { CheckIcon, ChevronDownIcon, GlobeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale, useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';
import { startTransition } from 'react';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';

const localeFlag = {
  en: '🇺🇸',
  ru: '🇷🇺',
};

export function LocaleSwitcher() {
  const t = useTranslations('BasePage');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      // @ts-expect-error
      router.replace({ pathname, params }, { locale: nextLocale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <GlobeIcon className="size-5" />
          <span>{locale.toUpperCase()}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {routing.locales.map((loc) => (
          <DropdownMenuItem onClick={() => onSelectChange(loc)} key={loc}>
            <span className="w-4">{localeFlag[loc]}</span>
            {t(`header.language-switcher.${loc}`)}
            {locale === loc && <CheckIcon className="h-5 w-5 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
