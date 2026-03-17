import type {
  StrapiMedia,
  StrapiEntity,
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from './types.js';
import type {
  Country,
  Conflict,
  EquipmentCategory,
  EquipmentType,
  EquipmentLoss,
  Tag,
} from '../models/index.js';

// ─── Helpers ───

function mediaUrl(
  media: StrapiMedia | null | undefined,
  baseUrl: string
): string | null {
  if (!media?.url) return null;
  // Strapi returns relative URLs in dev, absolute in prod with providers
  return media.url.startsWith('http') ? media.url : `${baseUrl}${media.url}`;
}

function mediaUrls(
  media: StrapiMedia[] | null | undefined,
  baseUrl: string
): string[] {
  if (!media) return [];
  return media
    .map((m) => mediaUrl(m, baseUrl))
    .filter((url): url is string => url !== null);
}

// ─── Entity transforms ───

export function toCountry(
  raw: StrapiEntity<{
    name: string;
    code: string;
    flag?: StrapiMedia | null;
    side: Country['side'];
  }>,
  baseUrl: string
): Country {
  return {
    id: raw.id,
    name: raw.name,
    code: raw.code,
    flagUrl: mediaUrl(raw.flag, baseUrl),
    side: raw.side,
  };
}

export function toConflict(
  raw: StrapiEntity<{
    name: string;
    slug: string;
    description: string;
    startDate: string;
    endDate: string | null;
    countries?: StrapiEntity<{
      name: string;
      code: string;
      flag?: StrapiMedia | null;
      side: Country['side'];
    }>[];
  }>,
  baseUrl: string
): Conflict {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? '',
    startDate: raw.startDate,
    endDate: raw.endDate,
    countries: (raw.countries ?? []).map((c) => toCountry(c, baseUrl)),
  };
}

export function toEquipmentCategory(
  raw: StrapiEntity<{
    name: string;
    slug: string;
    icon?: StrapiMedia | null;
    parent?: StrapiEntity<{
      name: string;
      slug: string;
      icon?: StrapiMedia | null;
      sortOrder: number;
    }> | null;
    children?: StrapiEntity<{
      name: string;
      slug: string;
      icon?: StrapiMedia | null;
      sortOrder: number;
    }>[];
    sortOrder: number;
  }>,
  baseUrl: string
): EquipmentCategory {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    iconUrl: mediaUrl(raw.icon, baseUrl),
    parentId: raw.parent?.id ?? null,
    children: (raw.children ?? []).map((c) =>
      toEquipmentCategory({ ...c, children: [] }, baseUrl)
    ),
    sortOrder: raw.sortOrder,
  };
}

export function toEquipmentType(
  raw: StrapiEntity<{
    name: string;
    slug: string;
    designation?: string | null;
    description?: string;
    category?: StrapiEntity<{
      name: string;
      slug: string;
      icon?: StrapiMedia | null;
      sortOrder: number;
    }> | null;
    country?: StrapiEntity<{
      name: string;
      code: string;
      flag?: StrapiMedia | null;
      side: Country['side'];
    }> | null;
    thumbnail?: StrapiMedia | null;
    specifications?: Record<string, string | number>;
  }>,
  baseUrl: string
): EquipmentType {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    designation: raw.designation ?? null,
    description: raw.description ?? '',
    category: raw.category
      ? toEquipmentCategory(
          { ...raw.category, children: [], sortOrder: raw.category.sortOrder },
          baseUrl
        )
      : null,
    originCountry: raw.country ? toCountry(raw.country, baseUrl) : null,
    thumbnailUrl: mediaUrl(raw.thumbnail, baseUrl),
    specifications: raw.specifications ?? {},
  };
}

export function toTag(
  raw: StrapiEntity<{ name: string; slug: string }>
): Tag {
  return { id: raw.id, name: raw.name, slug: raw.slug };
}

export function toEquipmentLoss(
  raw: StrapiEntity<{
    title: string;
    slug: string;
    status: EquipmentLoss['status'];
    date: string;
    equipmentType?: Parameters<typeof toEquipmentType>[0] | null;
    operator?: Parameters<typeof toCountry>[0] | null;
    conflict?: Parameters<typeof toConflict>[0] | null;
    latitude?: number | null;
    longitude?: number | null;
    locationName?: string | null;
    evidence?: StrapiMedia[] | null;
    sourceUrl?: string | null;
    description?: string;
    verificationStatus: EquipmentLoss['verificationStatus'];
    verifiedAt?: string | null;
    tags?: StrapiEntity<{ name: string; slug: string }>[];
  }>,
  baseUrl: string
): EquipmentLoss {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    status: raw.status,
    date: raw.date,
    equipmentType: raw.equipmentType
      ? toEquipmentType(raw.equipmentType, baseUrl)
      : null,
    operator: raw.operator ? toCountry(raw.operator, baseUrl) : null,
    conflict: raw.conflict ? toConflict(raw.conflict, baseUrl) : null,
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    locationName: raw.locationName ?? null,
    evidenceUrls: mediaUrls(raw.evidence, baseUrl),
    sourceUrl: raw.sourceUrl ?? null,
    description: raw.description ?? '',
    verificationStatus: raw.verificationStatus,
    verifiedAt: raw.verifiedAt ?? null,
    tags: (raw.tags ?? []).map(toTag),
  };
}

// ─── Collection helpers ───

export function mapCollection<TRaw, TDomain>(
  response: StrapiCollectionResponse<TRaw>,
  transform: (entity: StrapiEntity<TRaw>, baseUrl: string) => TDomain,
  baseUrl: string
): { data: TDomain[]; pagination: StrapiCollectionResponse<TRaw>['meta']['pagination'] } {
  return {
    data: response.data.map((entity) => transform(entity, baseUrl)),
    pagination: response.meta.pagination,
  };
}

export function mapSingle<TRaw, TDomain>(
  response: StrapiSingleResponse<TRaw>,
  transform: (entity: StrapiEntity<TRaw>, baseUrl: string) => TDomain,
  baseUrl: string
): TDomain {
  return transform(response.data, baseUrl);
}
