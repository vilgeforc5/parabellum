import { setRequestLocale } from 'next-intl/server';

type LocaleParams = { locale: string };

type PageProps<P = object> = P & {
  params: Promise<LocaleParams & Record<string, string>>;
};

// this hoc should be used to wrap statically rendered page.
// enables i18n request cache
export function withLocale<P = object>(
  Component: (
    props: P & { locale: string },
  ) => React.ReactNode | Promise<React.ReactNode>,
) {
  return async function LocalePage(props: PageProps<P>) {
    const params = await props.params;
    setRequestLocale(params.locale);
    return Component({ ...props, locale: params.locale });
  };
}
