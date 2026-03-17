'use client';

import type { ReactNode } from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { cn } from '@/lib/utils';

const shellRoutes = new Set(['about-us']);

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const segments = useSelectedLayoutSegments();
  const showShell =
    segments.length === 0 ||
    (segments.length === 1 && shellRoutes.has(segments[0]));

  return (
    <>
      {showShell ? <Navbar /> : null}
      <main
        className={cn(
          'flex-1',
          showShell ? 'container mx-auto px-4 py-6' : 'px-0 py-0',
        )}
      >
        {children}
      </main>
      {showShell ? <Footer /> : null}
    </>
  );
}
