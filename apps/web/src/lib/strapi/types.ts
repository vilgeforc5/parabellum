import type { Modules } from '@strapi/types';

export type ReadTimeBucket = 'short' | 'medium' | 'long';

export type StrapiBlogPostCategory = Modules.Documents.Result<
  'api::blog-post-category.blog-post-category'
>;
export type StrapiCountry = Modules.Documents.Result<'api::country.country'>;
export type StrapiDestroyedBy = Modules.Documents.Result<
  'api::destroyed-by.destroyed-by'
>;
export type StrapiEquipmentType = Modules.Documents.Result<
  'api::equipment-type.equipment-type'
>;
export type StrapiRegion = Modules.Documents.Result<'api::region.region'>;
export type StrapiStatus = Modules.Documents.Result<'api::status.status'>;
export type StrapiUploadFile = Modules.Documents.Result<'plugin::upload.file'>;
export type StrapiWarConflict = Modules.Documents.Result<
  'api::war-conflict.war-conflict'
>;
type PopulatedStrapiEquipment = Modules.Documents.Result<
  'api::equipment.equipment',
  { populate: ['originCountry', 'type'] }
>;

type PopulatedStrapiBlogPost = Modules.Documents.Result<
  'api::blog-post.blog-post',
  { populate: ['category'] }
>;
type PopulatedStrapiDestroyedEquipment = Modules.Documents.Result<
  'api::destroyed-equipment.destroyed-equipment',
  {
    populate: [
      'country',
      'destroyedBy',
      'equipment',
      'region',
      'status',
      'warConflict',
    ];
  }
>;

export type StrapiBlogPost = Omit<PopulatedStrapiBlogPost, 'category' | 'coverImage'> & {
  category?: StrapiBlogPostCategory | null;
  coverImage?: StrapiUploadFile | null;
};
export type StrapiEquipment = Omit<
  PopulatedStrapiEquipment,
  'originCountry' | 'type'
> & {
  originCountry?: StrapiCountry | null;
  type?: StrapiEquipmentType | null;
};
export type StrapiDestroyedEquipment = Omit<
  PopulatedStrapiDestroyedEquipment,
  'country' | 'destroyedBy' | 'equipment' | 'region' | 'status' | 'warConflict'
> & {
  country?: StrapiCountry | null;
  destroyedBy?: StrapiDestroyedBy[] | null;
  equipment?: StrapiEquipment | null;
  region?: StrapiRegion | null;
  status?: StrapiStatus | null;
  warConflict?: StrapiWarConflict | null;
};

export type BlogPostContent = StrapiBlogPost['content'];

export interface BlogPostCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: BlogPostContent | null;
  coverImageUrl: string | null;
  author: string | null;
  readTime: number | null;
  category: BlogPostCategory | null;
  publishedAt: string | null;
  updatedAt: string | null;
}

export interface Country {
  id: number;
  documentId: string;
  code: string;
  name: string;
  slug: string;
}

export interface DestroyedBy {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface EquipmentType {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface Equipment {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  originCountry: Country | null;
  type: EquipmentType | null;
}

export interface Region {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface Status {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface WarConflict {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface HomeHeroStats {
  verifiedLosses: number;
  activeConflicts: number;
  blogPosts: number;
}

export type LossStatusKey = 'destroyed' | 'damaged' | 'captured' | 'abandoned';

export interface HomeTimelinePoint {
  date: string;
  count: number;
  destroyed: number;
  damaged: number;
  captured: number;
  abandoned: number;
}

export interface HomeCategoryStats {
  name: string;
  slug: string;
  count: number;
  byStatus: Record<LossStatusKey, number>;
}

export interface HomePageAnalytics {
  heroStats: HomeHeroStats;
  timeline: HomeTimelinePoint[];
  categories: HomeCategoryStats[];
}

export interface ConflictAnalyticsSectionData {
  conflicts: WarConflict[];
  selectedConflict: WarConflict | null;
  timeline: HomeTimelinePoint[];
  categories: HomeCategoryStats[];
}

export interface DestroyedEquipment {
  id: number;
  documentId: string;
  sourceRecordId: number;
  reportId: number;
  reportedAt: string | null;
  eventDate: string | null;
  eventDateRaw: string | null;
  equipmentLabel: string | null;
  equipmentModification: string | null;
  equipment: Equipment | null;
  quantity: number;
  sourceFlag: boolean;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number | null;
  country: Country | null;
  region: Region | null;
  status: Status | null;
  warConflict: WarConflict | null;
  destroyedBy: DestroyedBy[];
}
