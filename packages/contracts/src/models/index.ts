// ─── Core domain models ───
// These are the clean types your frontend works with.
// They are decoupled from Strapi's response shape.

export interface Country {
  id: number;
  name: string;
  code: string; // ISO 3166-1 alpha-2
  flagUrl: string | null;
  side: 'aggressor' | 'defender' | 'other';
}

export interface Conflict {
  id: number;
  name: string;
  slug: string;
  description: string;
  startDate: string; // ISO date
  endDate: string | null;
  countries: Country[];
}

export interface EquipmentCategory {
  id: number;
  name: string;
  slug: string;
  iconUrl: string | null;
  parentId: number | null;
  children: EquipmentCategory[];
  sortOrder: number;
}

export interface EquipmentType {
  id: number;
  name: string;
  slug: string;
  designation: string | null;
  description: string;
  category: EquipmentCategory | null;
  originCountry: Country | null;
  thumbnailUrl: string | null;
  specifications: Record<string, string | number>;
}

export type LossStatus = 'destroyed' | 'damaged' | 'captured' | 'abandoned';
export type VerificationStatus =
  | 'pending'
  | 'confirmed'
  | 'disputed'
  | 'rejected';

export interface EquipmentLoss {
  id: number;
  title: string;
  slug: string;
  status: LossStatus;
  date: string; // ISO date
  equipmentType: EquipmentType | null;
  operator: Country | null;
  conflict: Conflict | null;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  evidenceUrls: string[];
  sourceUrl: string | null;
  description: string;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export type ReviewStatus = 'new' | 'under_review' | 'accepted' | 'rejected';

export interface UserReport {
  id: number;
  description: string;
  equipmentCategory: EquipmentCategory | null;
  status: LossStatus | 'unknown';
  date: string | null;
  locationName: string | null;
  latitude: number | null;
  longitude: number | null;
  evidenceUrls: string[];
  sourceUrl: string | null;
  submitterEmail: string;
  reviewStatus: ReviewStatus;
  linkedLossId: number | null;
}

// ─── Analytics response types ───

export interface AnalyticsSummary {
  totalLosses: number;
  byStatus: Record<LossStatus, number>;
  byCountry: Array<{ country: Country; count: number }>;
  last24h: number;
  last7d: number;
}

export interface TimelineDataPoint {
  date: string;
  count: number;
  destroyed: number;
  damaged: number;
  captured: number;
  abandoned: number;
}

export interface CategoryBreakdown {
  category: EquipmentCategory;
  count: number;
  byStatus: Record<LossStatus, number>;
}

export interface GeographicCluster {
  latitude: number;
  longitude: number;
  count: number;
  losses: Array<{ id: number; title: string; status: LossStatus }>;
}
