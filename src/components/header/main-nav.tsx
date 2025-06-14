import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLocalizedLink,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { getTranslations } from 'next-intl/server';

export async function MainNav({ className }: { className?: string }) {
  const t = await getTranslations('BasePage');

  return (
    <NavigationMenu className={className} viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLocalizedLink href="/">{t('header.nav.main.title')}</NavigationMenuLocalizedLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t('header.nav.analytics.title')}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-4">
              {t.raw('header.nav.analytics.categories').map((item: { title: string; description: string }) => (
                <li key={item.title}>
                  <NavigationMenuLocalizedLink href="#">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-muted-foreground">{item.description}</div>
                  </NavigationMenuLocalizedLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLocalizedLink href="/">{t('header.nav.about.title')}</NavigationMenuLocalizedLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
