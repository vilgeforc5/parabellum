import React from 'react';
import './globals.css';
import { Header } from '@/components/header/header';

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
};

export const experimental_ppr = true;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="dark">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
} 