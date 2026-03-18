import { MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DestroyedEquipment } from '@/lib/strapi';

function formatDate(value: string | null) {
  if (!value) return null;
  try {
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)));
  } catch {
    return value;
  }
}

interface LossesTableProps {
  losses: DestroyedEquipment[];
  total: number;
  page: number;
  pageSize: number;
  conflictSlug: string;
  labels: {
    columnMedia: string;
    columnLoss: string;
    columnLostBy: string;
    columnLocation: string;
    columnDate: string;
    noLosses: string;
    noLossesHint: string;
    viewOnMap: string;
    prevPage: string;
    nextPage: string;
    pageOf: (page: number, total: number) => string;
  };
  currentParams: Record<string, string>;
}

function buildPageUrl(
  currentParams: Record<string, string>,
  page: number,
): string {
  const params = new URLSearchParams(currentParams);
  params.set('page', String(page));
  return `/analytics?${params.toString()}`;
}

export function LossesTable({
  losses,
  total,
  page,
  pageSize,
  conflictSlug,
  labels,
  currentParams,
}: LossesTableProps) {
  const totalPages = Math.ceil(total / pageSize);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  if (losses.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/40 py-16 text-center">
        <p className="font-medium text-muted-foreground">{labels.noLosses}</p>
        <p className="mt-1 text-sm text-muted-foreground/70">{labels.noLossesHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="rounded-xl border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-12">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-20 hidden sm:table-cell">
                  {labels.columnMedia}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {labels.columnLoss}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                  {labels.columnLostBy}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                  {labels.columnLocation}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  {labels.columnDate}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {losses.map((loss) => {
                const mapUrl = loss.latitude != null && loss.longitude != null
                  ? `/map?conflict=${conflictSlug}&lat=${loss.latitude}&lng=${loss.longitude}`
                  : null;

                return (
                  <tr
                    key={loss.documentId}
                    className="group hover:bg-muted/20 transition-colors"
                  >
                    {/* Record # */}
                    <td className="px-4 py-3 text-muted-foreground tabular-nums text-xs">
                      {loss.sourceRecordId || '—'}
                    </td>

                    {/* Media thumbnail placeholder */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="h-12 w-16 rounded-md bg-muted/40 flex items-center justify-center overflow-hidden">
                        {loss.equipment?.type?.previewSvgUrl ? (
                          <img
                            src={loss.equipment.type.previewSvgUrl}
                            alt=""
                            aria-hidden
                            className="max-h-10 max-w-[56px] object-contain opacity-50"
                          />
                        ) : (
                          <div className="h-6 w-8 rounded bg-muted/60" />
                        )}
                      </div>
                    </td>

                    {/* Loss info */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/analytics/${loss.documentId}`}
                        className="group/link block"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          {loss.status && (
                            <StatusBadge status={loss.status.slug} />
                          )}
                          <span className="font-medium group-hover/link:text-primary transition-colors">
                            {loss.equipment?.name ?? loss.equipmentLabel ?? 'Unknown'}
                          </span>
                        </div>
                        {loss.equipment?.type && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {loss.equipment.type.name}
                          </p>
                        )}
                        {loss.equipmentModification && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {loss.equipmentModification.split(',').map((mod) => (
                              <Badge
                                key={mod}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {mod.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Link>
                    </td>

                    {/* Lost by */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      {loss.country && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">
                            {loss.country.code}
                          </span>
                          <span className="text-sm">{loss.country.name}</span>
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        {mapUrl ? (
                          <Link
                            href={mapUrl}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                            title={labels.viewOnMap}
                          >
                            <MapPin className="h-3 w-3 shrink-0" />
                            {loss.region?.name ?? '—'}
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {loss.region?.name ?? '—'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-right text-sm text-muted-foreground whitespace-nowrap tabular-nums">
                      {formatDate(loss.eventDate ?? loss.reportedAt) ?? '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {labels.pageOf(page, totalPages)}
          </p>
          <div className="flex gap-2">
            {hasPrev ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={buildPageUrl(currentParams, page - 1)}>
                  {labels.prevPage}
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                {labels.prevPage}
              </Button>
            )}
            {hasNext ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={buildPageUrl(currentParams, page + 1)}>
                  {labels.nextPage}
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                {labels.nextPage}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
