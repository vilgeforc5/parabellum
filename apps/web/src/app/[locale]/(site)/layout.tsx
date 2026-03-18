import type { ReactNode } from 'react';
import { AppShell } from '@/components/app-shell';

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
