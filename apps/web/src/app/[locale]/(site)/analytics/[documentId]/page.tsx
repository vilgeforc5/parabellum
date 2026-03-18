import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  MapPin,
  ArrowLeft,
  ExternalLink,
  Camera,
  Video,
  Flag,
  Calendar,
  Crosshair,
  Swords,
  Hash,
} from 'lucide-react';
import { withLocale } from '@/lib/with-locale';
import { getLossById } from '@/lib/strapi';
import { Link } from '@/i18n/navigation';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ documentId: string; locale: string }>;
}): Promise<Metadata> {
  const { documentId } = await params;
  const loss = await getLossById(documentId).catch(() => null);
  if (!loss) return { title: 'Loss Record' };
  return {
    title: loss.equipment?.name ?? loss.equipmentLabel ?? 'Loss Record',
  };
}

function formatDate(value: string | null) {
  if (!value) return null;
  try {
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)));
  } catch {
    return value;
  }
}

// Mock gallery items with varied aspect ratios to simulate a real evidence gallery
const MOCK_GALLERY = [
  { type: 'photo' as const, aspect: 'aspect-video', label: 'Drone footage' },
  { type: 'photo' as const, aspect: 'aspect-square', label: 'Ground photo' },
  { type: 'video' as const, aspect: 'aspect-[4/3]', label: 'Video evidence' },
  { type: 'photo' as const, aspect: 'aspect-[3/4]', label: 'Close-up' },
  { type: 'photo' as const, aspect: 'aspect-video', label: 'Wide shot' },
  { type: 'video' as const, aspect: 'aspect-square', label: 'Video clip' },
];

export default withLocale(async function LossDetailPage({
  params,
}: {
  locale: string;
  params: Promise<{ documentId: string; locale: string }>;
}) {
  const { documentId } = await params;

  const [loss, t] = await Promise.all([
    getLossById(documentId).catch(() => null),
    getTranslations('AnalyticsPage'),
  ]);

  if (!loss) notFound();

  const mapUrl =
    loss.latitude != null && loss.longitude != null
      ? `/map?conflict=${loss.warConflict?.slug ?? 'russo-ukrainian-war'}&lat=${loss.latitude}&lng=${loss.longitude}`
      : null;

  const displayName = loss.equipment?.name ?? loss.equipmentLabel ?? 'Unknown Equipment';

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8 space-y-6">
      {/* Back link + Title row */}
      <div className="space-y-3">
        <Link
          href="/analytics"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToAnalytics')}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {loss.status && <StatusBadge status={loss.status.slug} />}
              {loss.equipment?.type && (
                <Badge variant="secondary">{loss.equipment.type.name}</Badge>
              )}
              {loss.sourceRecordId ? (
                <span className="text-sm text-muted-foreground tabular-nums">
                  #{loss.sourceRecordId}
                </span>
              ) : null}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
            {loss.equipmentModification && (
              <div className="flex flex-wrap gap-1.5">
                {loss.equipmentModification.split(',').map((mod) => (
                  <Badge key={mod} variant="outline" className="text-xs">
                    {mod.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {mapUrl && (
            <Button asChild variant="outline" className="gap-2 shrink-0">
              <Link href={mapUrl}>
                <MapPin className="h-4 w-4" />
                {t('viewOnMap')}
                <ExternalLink className="h-3.5 w-3.5 opacity-50" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Main content: media left, details right */}
      <div className="grid gap-8 lg:grid-cols-[3fr_2fr] items-start">

        {/* LEFT — Media gallery (masonry via CSS columns) */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold">{t('lossDetailMedia')}</h2>

          <div className="grid grid-cols-3 gap-2">
            {MOCK_GALLERY.map((item, i) => (
              <div
                key={i}
                className={`${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'} rounded-lg border border-dashed border-border/50 bg-muted/20 flex flex-col items-center justify-center gap-2 overflow-hidden`}
              >
                <div className="text-muted-foreground/30">
                  {item.type === 'video' ? (
                    <Video className="h-8 w-8" />
                  ) : (
                    <Camera className="h-8 w-8" />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground/50 text-center px-2">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Equipment info + details */}
        <div className="space-y-4 lg:sticky lg:top-24">
          {/* SVG preview card */}
          <div className="relative h-52 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-secondary to-background flex items-center justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:4px_4px]" />
            {loss.equipment?.type?.previewSvgUrl ? (
              <img
                src={loss.equipment.type.previewSvgUrl}
                alt=""
                aria-hidden
                className="relative max-h-36 max-w-[70%] object-contain opacity-90 drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
              />
            ) : (
              <div className="h-24 w-32 rounded-xl bg-muted/30" />
            )}
          </div>

          {/* Details card */}
          <Card>
            <CardContent className="p-5 space-y-4">
              {[
                {
                  icon: <Flag className="h-4 w-4" />,
                  label: t('lossDetailCountry'),
                  value: loss.country
                    ? `${loss.country.code} · ${loss.country.name}`
                    : null,
                },
                {
                  icon: <Calendar className="h-4 w-4" />,
                  label: t('lossDetailDate'),
                  value: formatDate(loss.eventDate ?? loss.reportedAt),
                },
                {
                  icon: <MapPin className="h-4 w-4" />,
                  label: t('lossDetailLocation'),
                  value: loss.region?.name ?? null,
                },
                {
                  icon: <Crosshair className="h-4 w-4" />,
                  label: t('lossDetailConflict'),
                  value: loss.warConflict?.name ?? null,
                },
                {
                  icon: <Swords className="h-4 w-4" />,
                  label: t('lossDetailDestroyedBy'),
                  value:
                    loss.destroyedBy.length > 0
                      ? loss.destroyedBy.map((d) => d.name).join(', ')
                      : null,
                },
                {
                  icon: <Hash className="h-4 w-4" />,
                  label: t('lossDetailSourceRecord'),
                  value: loss.sourceRecordId ? String(loss.sourceRecordId) : null,
                },
              ]
                .filter(({ value }) => value)
                .map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}

              {loss.latitude != null && loss.longitude != null && (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">GPS</p>
                    <p className="text-sm font-mono text-muted-foreground">
                      {loss.latitude.toFixed(5)}, {loss.longitude.toFixed(5)}
                    </p>
                  </div>
                </div>
              )}

              {loss.equipment?.originCountry && (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-muted-foreground">
                    <Flag className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">Origin</p>
                    <p className="text-sm font-medium">{loss.equipment.originCountry.name}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
});
