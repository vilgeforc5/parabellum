'use client';

import { BarChart3, FileText, HomeIcon, Info, Map } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/components/locale-switcher';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { LogoIcon } from '@/components/ui/logo-icon';
import { Link, usePathname } from '@/i18n/navigation';

const navLinks = [
  { href: '/', label: 'home', icon: HomeIcon },
  { href: '/analytics', label: 'analytics', icon: BarChart3 },
  { href: '/analytics/map', label: 'map', icon: Map },
  { href: '/blog', label: 'blog', icon: FileText },
  { href: '/about-us', label: 'about', icon: Info },
];

export function Navbar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  const activeHref =
    navLinks
      .filter(({ href }) =>
        href === '/'
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`),
      )
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <LogoIcon className="h-5 w-5" />
          <span>{t('brand')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Button key={href} variant="ghost" size="sm" asChild>
              <Link
                href={href}
                className="flex items-center gap-1.5"
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 md:hidden">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">{t('home')}</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/about-us">{t('about')}</Link>
            </Button>
          </div>
          <ModeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
