import { MainNav } from '@/components/header/main-nav';
import { Title } from '@/components/header/title';
import { Socials } from '@/components/header/socials';
import { LocaleSwitcher } from '@/components/header/locale-switcher';

export function Header() {
  return (
    <header className="p-6 flex items-center justify-between">
      <Title />
      <MainNav className="mx-auto" />
      <Socials />
      <LocaleSwitcher />
    </header>
  );
}
