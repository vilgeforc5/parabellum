import type { Modules } from '@strapi/types';

export type ReadTimeBucket = 'short' | 'medium' | 'long';

export type StrapiBlogPostCategory = Modules.Documents.Result<
  'api::blog-post-category.blog-post-category'
>;
export type StrapiUploadFile = Modules.Documents.Result<'plugin::upload.file'>;

type PopulatedStrapiBlogPost = Modules.Documents.Result<
  'api::blog-post.blog-post',
  { populate: ['category'] }
>;

export type StrapiBlogPost = Omit<PopulatedStrapiBlogPost, 'category' | 'coverImage'> & {
  category?: StrapiBlogPostCategory | null;
  coverImage?: StrapiUploadFile | null;
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
