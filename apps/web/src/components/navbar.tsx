import { useTranslations } from 'next-intl';
import { BarChart3, Crosshair, FileText, Map, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Link } from '@/i18n/navigation';

const navLinks = [
  { href: '/', label: 'home', icon: Crosshair },
  { href: '/analytics', label: 'analytics', icon: BarChart3 },
  { href: '/analytics/map', label: 'map', icon: Map },
  { href: '/blog', label: 'blog', icon: FileText },
  { href: '/submit', label: 'report', icon: Send },
];

export function Navbar() {
  const t = useTranslations('Navigation');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Crosshair className="h-5 w-5 text-chart-1" />
          <span>{t('brand')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Button key={href} variant="ghost" size="sm" asChild>
              <Link href={href} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4" />
                {t(label)}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">{t('home')}</Link>
            </Button>
          </div>
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
