import type { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
        {children}
      </main>
      <Footer />
    </>
  );
}
