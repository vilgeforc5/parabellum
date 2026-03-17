import './global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Parabellum — Military Equipment Analytics',
  description:
    'Open-source military equipment loss tracking and analytics platform. Verified data, interactive charts, and geospatial mapping.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <Navbar />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
