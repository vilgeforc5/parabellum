import { SectionWrapper } from '../ui/section-wrapper';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Loss } from '@/payload-types';

interface RecentLossTableProps {
  data: Array<{
    id: number | string;
    images: string[];
    type: string;
    status: Loss['status'];
    badges?: string[];
    location?: string;
  }>;
}

export function RecentLossTable({ data }: RecentLossTableProps) {
  return (
    <SectionWrapper>
      <p className="max-lg:text-2xl text-3xl font-bold">Недавно добавленные</p>
      <Link href="/" className="text-primary underline">
        Смотреть еще
      </Link>
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] min-w-[50px] text-muted-foreground">#</TableHead>
            <TableHead className="w-[200px] min-w-[200px] text-muted-foreground">Фото</TableHead>
            <TableHead className="text-muted-foreground">Тип</TableHead>
            <TableHead className="text-muted-foreground">Статус</TableHead>
            <TableHead className="max-lg:hidden text-muted-foreground">Локация</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const badges = [
              {
                variant:
                  item.status === 'destroyed' ? 'destructive' : item.status === 'trophy' ? 'default' : 'info',
                text:
                  item.status === 'destroyed' ? 'уничтожен' : item.status === 'trophy' ? 'трофей' : 'поврежден',
              },
              ...(item.badges ? item.badges.map((text) => ({ variant: 'secondary', text })) : []),
            ];

            return (
              <TableRow className="cursor-pointer" key={item.id}>
                <TableCell className="font-medium text-muted-foreground">{item.id}</TableCell>
                <TableCell className="w-40">
                  <Images images={item.images} />
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2">
                    {badges.map(({ variant, text }, i) => (
                      <Badge key={i} variant={variant as any}>
                        {text}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-lg:hidden">{item.location}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </SectionWrapper>
  );
}

function Images({ images }: { images?: string[] }) {
  if (!images) return null;

  const overlap = 10;
  const shownSize = 2;

  const cardClass =
    'aspect-square rounded-lg max-lg:h-12 max-lg:w-12 max-lg:rounded-xs h-12 w-12 ring-2 ring-card';

  return (
    <div className="flex">
      {images
        ?.slice(0, shownSize)
        .map((src, i) => (
          <Image
            key={i}
            className={cardClass}
            style={{ transform: `translateX(-${i * overlap}px)` }}
            src={src}
            alt=""
            width={60}
            height={60}
          />
        ))}
      {images.length > shownSize && (
        <div
          className={cn(cardClass, ' text-center grid place-items-center text-lg text-muted-foreground bg-muted')}
          style={{ transform: `translateX(-${shownSize * overlap}px)` }}
        >
          +{images.length - shownSize}
        </div>
      )}
    </div>
  );
}
