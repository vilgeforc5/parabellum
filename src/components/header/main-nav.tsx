import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export const analyticsCategories = [
  {
    title: 'Потери',
    description: 'Статистика изменения потерь',
    href: '/',
  },
  {
    title: 'Блог',
    description: 'Аналитические статьи на основе обработанных данных',
    href: '/',
  },
];

export async function MainNav({ className }: { className?: string }) {
  return (
    <NavigationMenu className={className} viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">Главная</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Аналитика</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-4">
              {analyticsCategories.map((item) => (
                <li key={item.title}>
                  <NavigationMenuLink href={item.href}>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-muted-foreground">{item.description}</div>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">О нас</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
