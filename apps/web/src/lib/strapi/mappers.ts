import { toAbsoluteStrapiUrl } from './client';
import type {
  BlogPost,
  BlogPostCategory,
  Country,
  DestroyedBy,
  DestroyedEquipment,
  Equipment,
  EquipmentType,
  Region,
  Status,
  StrapiBlogPost,
  StrapiBlogPostCategory,
  StrapiCountry,
  StrapiDestroyedBy,
  StrapiDestroyedEquipment,
  StrapiEquipment,
  StrapiEquipmentType,
  StrapiRegion,
  StrapiStatus,
  StrapiUploadFile,
  StrapiWarConflict,
  WarConflict,
} from './types';

function asString(value: unknown) {
  return typeof value === 'string' ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === 'number' ? value : null;
}

function asBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : false;
}

function mapUploadFile(file: StrapiUploadFile | null | undefined) {
  if (!file) {
    return null;
  }

  return {
    id: Number(file.id),
    url: toAbsoluteStrapiUrl(asString(file.url)),
    alternativeText: asString(file.alternativeText),
  };
}

export function mapBlogPostCategory(
  entry: StrapiBlogPostCategory
): BlogPostCategory {
  return {
    id: Number(entry.id),
    documentId: entry.documentId,
    name: asString(entry.name) ?? '',
    slug: asString(entry.slug) ?? '',
    description: asString(entry.description),
  };
}

export function mapBlogPost(entry: StrapiBlogPost): BlogPost {
  const coverImage = mapUploadFile(entry.coverImage);

  return {
    id: Number(entry.id),
    documentId: entry.documentId,
    title: asString(entry.title) ?? '',
    slug: asString(entry.slug) ?? '',
    excerpt: asString(entry.excerpt) ?? '',
    content: entry.content ?? null,
    coverImageUrl: coverImage?.url ?? null,
    author: asString(entry.author),
    readTime: asNumber(entry.readTime),
    category: entry.category ? mapBlogPostCategory(entry.category) : null,
    publishedAt: asString(entry.publishedAt),
    updatedAt: asString(entry.updatedAt),
  };
}

export function mapCountry(entry: StrapiCountry): Country {
  return {
    id: Number(entry.id),
    documentId: entry.documentId,
    code: asString(entry.code) ?? '',
    name: asString(entry.name) ?? '',
    slug: asString(entry.slug) ?? '',
  };
}

export function mapDestroyedBy(entry: StrapiDestroyedBy): DestroyedBy {
  return {
    id: Number(entry.id),
    documentId: entry.documentId,
    name: asString(entry.name) ?? '',
    slug: asString(entry.slug) ?? '',
  };
}

export function mapEquipmentType(entry: StrapiEquipmentType): EquipmentType {
  const previewSvg = mapUploadFile(entry.previewSvg);

  return {
    id: Number(entry.id),
    documentId: entry.documentId,
    name: asString(entry.name) ?? '',
    slug: asString(entry.slug) ?? '',
    previewSvgUrl: previewSvg?.url ?? null,
  };
}

export function mapEquipment(entry: StrapiEquipment): Equipment {
  return {
    id: Number(entry.id),
    documentId: entry.documentId,
    name: asString(entry.name) ?? '',
    slug: asString(entry.slug) ?? '',
    originCountry: entry.originCountry ? mapCountry(entry.originCountry) : null,
    type: entry.type ? mapEquipmentType(entry.type) : null,
  };
}

export function mapRegion(entry: StrapiRegion): Region {
  return {
    id: Number(entry.id),
    documentId: entry.documentId,
    name: asString(entry.name) ?? '',
    slug: asString(entry.slug) ?? '',
  };
}

export function mapStatus(entry: StrapiStatus): Status {
  return {
    id: Number(entry.id),
    documentId: entry.documentId,
    name: asString(entry.name) ?? '',
    slug: asString(entry.slug) ?? '',
  };
}

export function mapWarConflict(entry: StrapiWarConflict): WarConflict {
  return {
    id: Number(entry.id),
    documentId: entry.documentId,
    name: asString(entry.name) ?? '',
    slug: asString(entry.slug) ?? '',
  };
}

export function mapDestroyedEquipment(
  entry: StrapiDestroyedEquipment
): DestroyedEquipment {
  return {
    id: Number(entry.id),
    documentId: entry.documentId,
    sourceRecordId: asNumber(entry.sourceRecordId) ?? 0,
    reportId: asNumber(entry.reportId) ?? 0,
    reportedAt: asString(entry.reportedAt),
    eventDate: asString(entry.eventDate),
    eventDateRaw: asString(entry.eventDateRaw),
    equipmentLabel: asString(entry.equipmentLabel),
    equipmentModification: asString(entry.equipmentModification),
    equipment: entry.equipment ? mapEquipment(entry.equipment) : null,
    quantity: asNumber(entry.quantity) ?? 1,
    sourceFlag: asBoolean(entry.sourceFlag),
    latitude: asNumber(entry.latitude),
    longitude: asNumber(entry.longitude),
    distanceKm: asNumber(entry.distanceKm),
    country: entry.country ? mapCountry(entry.country) : null,
    region: entry.region ? mapRegion(entry.region) : null,
    status: entry.status ? mapStatus(entry.status) : null,
    warConflict: entry.warConflict ? mapWarConflict(entry.warConflict) : null,
    destroyedBy: Array.isArray(entry.destroyedBy)
      ? entry.destroyedBy.map(mapDestroyedBy)
      : [],
  };
}
