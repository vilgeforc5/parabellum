import { getTranslations } from 'next-intl/server';

import { NotFoundPage } from '@/components/not-found-page';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default async function LocaleNotFoundPage() {
  const t = await getTranslations('NotFoundPage');

  return (
    <NotFoundPage
      title={t('title')}
      description={t('description')}
      action={
        <Button asChild size="lg">
          <Link href="/">{t('homeLink')}</Link>
        </Button>
      }
    />
  );
}
