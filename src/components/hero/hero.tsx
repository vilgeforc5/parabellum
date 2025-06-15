import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export async function Hero({ className }: { className?: string }) {
  return (
    <section className={className}>
      <div className="grid px-3 lg:px-6 lg:pr-0 items-center gap-8 lg:gap-16 xl:gap-20 ">
        <div className="flex flex-col items-center text-center ">
          <h1 className="my-6 font-bold text-4xl lg:text-5xl">Аналитическая платформа</h1>
          <p className="text-muted-foreground mb-8 max-w-xl lg:text-lg xl:text-xl">Анализ военных конфликтов статьях, графиках и данных Блог о военных конфликтах, стратегиях и технике. Глубокие обзоры, визуализация данных, анализ на стыке истории и статистики.</p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/">Смотреть</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">
                Узнать больше
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
