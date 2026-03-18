import type { ReactNode } from 'react';
import { Navbar } from '@/components/navbar';

type MapLayoutProps = {
  children: ReactNode;
};

export default function MapLayout({ children }: MapLayoutProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Navbar />
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
