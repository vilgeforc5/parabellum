'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  ChevronRight,
  FileText,
  HomeIcon,
  Info,
  Map,
  Menu,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/components/locale-switcher';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { LogoIcon } from '@/components/ui/logo-icon';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'home', icon: HomeIcon },
  { href: '/analytics', label: 'analytics', icon: BarChart3 },
  { href: '/analytics/map', label: 'map', icon: Map },
  { href: '/blog', label: 'blog', icon: FileText },
  { href: '/about-us', label: 'about', icon: Info },
];

export function Navbar() {
  const t = useTranslations('Navigation');
  const tLocale = useTranslations('LocaleSwitcher');
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeHref =
    navLinks
      .filter(({ href }) =>
        href === '/'
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`),
      )
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? '/';

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card/80 shadow-sm">
            <LogoIcon className="h-5 w-5" />
          </span>
          <span className="truncate font-bold text-lg">{t('brand')}</span>
        </Link>

        <nav className="hidden h-12 items-stretch gap-1 rounded-full border border-border/70 bg-background/70 p-1 shadow-sm backdrop-blur-sm md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              variant="ghost"
              size="sm"
              className="h-full rounded-full"
              asChild
            >
              <Link
                href={href}
                className={cn(
                  'flex h-full items-center gap-1.5 px-4',
                  href === activeHref && 'bg-accent shadow-sm',
                )}
                aria-current={href === activeHref ? 'page' : undefined}
              >
                {Icon ? (
                  <Icon
                    className={
                      href === activeHref ? 'h-4 w-4 text-chart-1' : 'h-4 w-4'
                    }
                  />
                ) : null}
                {t(label)}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />
          <LocaleSwitcher />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-border/70 bg-background/70 pl-2.5 pr-3 shadow-sm backdrop-blur-sm"
              >
                <Menu className="h-4 w-4" />
                <span>{t('menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="inset-x-3 top-[4.5rem] rounded-[1.75rem] border border-border/80 bg-background/95 p-0 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
            >
              <SheetHeader className="border-b border-border/70 px-5 pt-5 pb-4 text-left">
                <SheetTitle className="flex items-center gap-3 text-base">
                  <span className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-card/80 shadow-sm">
                    <LogoIcon className="h-5 w-5" />
                  </span>
                  <span>{t('brand')}</span>
                </SheetTitle>
                <SheetDescription>{t('menuDescription')}</SheetDescription>
              </SheetHeader>

              <div className="space-y-3 px-4 py-4">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = href === activeHref;

                  return (
                    <SheetClose key={href} asChild>
                      <Link
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'group flex items-center justify-between rounded-[1.4rem] border px-4 py-3.5 transition-all',
                          isActive
                            ? 'border-primary/35 bg-primary/5 shadow-[0_18px_38px_-28px_rgba(225,29,72,0.85)]'
                            : 'border-border/70 bg-card/80 shadow-sm hover:border-primary/20 hover:bg-accent/70',
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={cn(
                              'flex size-10 items-center justify-center rounded-2xl border shadow-sm transition-colors',
                              isActive
                                ? 'border-primary/20 bg-primary text-primary-foreground'
                                : 'border-border/60 bg-background/80 text-muted-foreground group-hover:text-foreground',
                            )}
                          >
                            <Icon className="h-[18px] w-[18px]" />
                          </span>
                          <span className="font-medium">{t(label)}</span>
                        </span>
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-transform',
                            isActive
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:translate-x-0.5 group-hover:text-foreground',
                          )}
                        />
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>

              <div className="px-4 pt-1 pb-4">
                <div className="rounded-[1.4rem] border border-border/70 bg-card/80 p-3 shadow-sm">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {t('preferences')}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{t('language')}</p>
                      <p className="text-xs text-muted-foreground">
                        {tLocale('label')}
                      </p>
                    </div>
                    <LocaleSwitcher />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
