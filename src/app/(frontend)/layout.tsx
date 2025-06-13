import React from 'react';
import './globals.css';
import { Header } from '@/components/header/header';

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en">
      <body className="dark p-6 bg-background">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
