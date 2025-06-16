import React from 'react';
import './globals.css';
import { Header } from '@/components/header/header';

export const metadata = {
  title: 'Parabellum',
};

export const experimental_ppr = true;

export const revalidate = 3600;

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="dark">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
