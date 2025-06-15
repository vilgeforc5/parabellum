import Link from 'next/link';

export function Title() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-xl font-bold text-foreground">Parabellum</span>
    </Link>
  );
}
