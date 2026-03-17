import { getTranslations } from 'next-intl/server';
import type { SVGProps } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from '@/i18n/navigation';

const FRIENDS_URL = 'https://lostarmour.info/help';

type IconProps = SVGProps<SVGSVGElement>;

function InsightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 4.75c-4.75 0-8.72 2.92-10.25 7.02a.6.6 0 0 0 0 .46C3.28 16.33 7.25 19.25 12 19.25s8.72-2.92 10.25-7.02a.6.6 0 0 0 0-.46C20.72 7.67 16.75 4.75 12 4.75Z"
        className="stroke-current"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="3.25"
        className="stroke-current"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="1.1" className="fill-current" />
    </svg>
  );
}

function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3.75 5.75 6v5.02c0 4.06 2.47 7.76 6.25 9.35 3.78-1.59 6.25-5.29 6.25-9.35V6L12 3.75Z"
        className="stroke-current"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="m9.5 12 1.7 1.7 3.3-3.45"
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function LinkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.25 13.75 8.5 15.5a3.18 3.18 0 1 1-4.5-4.5l3-3a3.18 3.18 0 0 1 4.5 0"
        className="stroke-current"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M13.75 10.25 15.5 8.5a3.18 3.18 0 1 1 4.5 4.5l-3 3a3.18 3.18 0 0 1-4.5 0"
        className="stroke-current"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="m9 15 6-6"
        className="stroke-current"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default async function AboutUsPage() {
  const t = await getTranslations('AboutPage');

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-10">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-chart-1">
          {t('eyebrow')}
        </p>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            {t('description')}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-primary/20 bg-card/60">
          <CardHeader className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-4 space-y-0">
            <div className="flex size-11 items-center justify-center self-center rounded-2xl bg-chart-1/10 text-chart-1 ring-1 ring-chart-1/15">
              <InsightIcon className="size-5" />
            </div>
            <div className="min-w-0 space-y-1.5">
              <CardTitle>{t('missionTitle')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-8 text-muted-foreground">
              {t('missionBody')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-4 space-y-0">
            <div className="flex size-11 items-center justify-center self-center rounded-2xl bg-chart-4/10 text-chart-4 ring-1 ring-chart-4/15">
              <ShieldIcon className="size-5" />
            </div>
            <div className="min-w-0 space-y-1.5">
              <CardTitle>{t('policyTitle')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-8 text-muted-foreground">
              {t.rich('policyBody', {
                bold: (chunks) => (
                  <strong className="font-semibold text-foreground">
                    {chunks}
                  </strong>
                ),
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-4 space-y-0">
            <div className="flex size-11 items-center justify-center self-center rounded-2xl bg-chart-2/10 text-chart-2 ring-1 ring-chart-2/15">
              <LinkIcon className="size-5" />
            </div>
            <div className="min-w-0 space-y-1.5">
              <CardTitle>{t('donationsTitle')}</CardTitle>
              <CardDescription>{t('linksTitle')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-base leading-8 text-muted-foreground">
              {t.rich('donationsBody', {
                link: (chunks) => (
                  <a
                    href={FRIENDS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-chart-1 underline decoration-chart-1/40 underline-offset-4 transition-colors hover:text-chart-2"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/analytics">{t('analyticsLink')}</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href={FRIENDS_URL} target="_blank" rel="noreferrer">
                  {t('friendsLink')}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
