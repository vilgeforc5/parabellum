'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const t = useTranslations('ThemeToggle');
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const label = !mounted
    ? t('toggleTheme')
    : isDark
      ? t('switchToLight')
      : t('switchToDark');
  const Icon = !mounted ? SunMoon : isDark ? Sun : Moon;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className="border-border/70 bg-background/70 shadow-sm backdrop-blur-sm"
      aria-label={label}
      title={label}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
