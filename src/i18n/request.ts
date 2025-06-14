import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import deepmerge from 'deepmerge';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const ru = await import(`./translations/messages/ru.json`);
  const req = await import(`./translations/messages/${locale}.json`);

  return {
    locale,
    messages: deepmerge(ru, req, { arrayMerge: (_dest, source) => source }),
  };
});
