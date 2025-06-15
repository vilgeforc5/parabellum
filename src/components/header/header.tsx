import { MainNav } from '@/components/header/main-nav';
import { Title } from '@/components/header/title';
import { Socials } from '@/components/header/socials';
import { MobileMenu } from '@/components/header/mobile-menu';

export function Header() {
  return (
    <header className="p-6 flex items-center justify-between">
      <Title />
      <MainNav className="mx-auto z-10 hidden lg:block" />
      <Socials className="hidden lg:flex" />
      <div className="lg:hidden">
        <MobileMenu />
      </div>
    </header>
  );
}
