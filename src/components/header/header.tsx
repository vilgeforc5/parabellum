import { MainNav } from '@/components/header/main-nav';
import { Title } from '@/components/header/title';
import { Socials } from '@/components/header/socials';

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <Title />
      <MainNav className="mx-auto" />
      <Socials />
    </header>
  );
}
