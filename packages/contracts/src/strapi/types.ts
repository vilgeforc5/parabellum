// ─── Strapi v5 REST API response types ───

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
  formats: Record<
    string,
    { url: string; width: number; height: number }
  > | null;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMeta {
  pagination?: StrapiPagination;
}

/** Single-item response: `GET /api/things/:id` */
export interface StrapiSingleResponse<T> {
  data: StrapiEntity<T>;
  meta: StrapiMeta;
}

/** Collection response: `GET /api/things` */
export interface StrapiCollectionResponse<T> {
  data: StrapiEntity<T>[];
  meta: StrapiMeta;
}

/** Each entity in Strapi v5 has id + documentId at the top level, rest are attributes */
export type StrapiEntity<T> = {
  id: number;
  documentId: string;
} & T;
