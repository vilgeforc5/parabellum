import '../global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn('bg-background font-sans antialiased', inter.variable)}
      >
        <NextTopLoader
          color="var(--chart-1)"
          showSpinner={false}
          shadow="0 0 10px var(--chart-1), 0 0 5px var(--chart-1)"
        />
        <div aria-hidden className="site-backdrop">
          <div className="site-grid" />
          <div className="site-vignette" />
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative z-10 flex min-h-screen flex-col">
            <NextIntlClientProvider messages={messages}>
              <AppShell>{children}</AppShell>
            </NextIntlClientProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
