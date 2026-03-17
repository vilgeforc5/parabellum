import Link from 'next/link';
import { Crosshair, BarChart3, Map, Send, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home', icon: Crosshair },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/analytics/map', label: 'Map', icon: Map },
  { href: '/submit', label: 'Report', icon: Send },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Crosshair className="h-5 w-5 text-chart-1" />
          <span>Parabellum</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Button key={href} variant="ghost" size="sm" asChild>
              <Link href={href} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile menu trigger (placeholder — can be wired up later) */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
