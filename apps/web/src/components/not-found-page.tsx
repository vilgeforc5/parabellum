import type { ReactNode } from 'react';

import {
  EmptyDescription,
  EmptyFooter,
  EmptyTitle,
} from '@/components/ui/empty';

type NotFoundPageProps = {
  action: ReactNode;
  description: string;
  title: string;
};

export function NotFoundPage({
  action,
  description,
  title,
}: NotFoundPageProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center text-center">
        <p className="w-full text-center text-7xl font-semibold  text-chart-1 sm:text-8xl">
          404
        </p>
        <EmptyTitle className="mt-8 text-center">{title}</EmptyTitle>
        <EmptyDescription className="mt-4 max-w-xl text-center">
          {description}
        </EmptyDescription>
        <EmptyFooter className="mt-8 justify-center">{action}</EmptyFooter>
      </div>
    </section>
  );
}
