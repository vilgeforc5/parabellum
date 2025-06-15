import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { analyticsCategories } from '@/components/header/main-nav';

export function MobileMenu() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Menu />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Навигация</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 p-4">
          <Button asChild variant="outline">
            <Link href="/">Главная</Link>
          </Button>
          {analyticsCategories.map((category) => (
            <Button
              key={category.title}
              asChild
              variant="outline"
              className="flex flex-col items-start h-auto p-4 gap-1"
            >
              <Link href={category.href}>
                <span className="text-sm font-medium leading-none mx-auto">{category.title}</span>
                <span className="text-xs text-muted-foreground whitespace-normal mx-auto mt-2">
                  {category.description}
                </span>
              </Link>
            </Button>
          ))}

          <Button asChild variant="outline">
            <Link href="/">О нас</Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
