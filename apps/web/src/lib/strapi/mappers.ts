import { toAbsoluteStrapiUrl } from './client';
import type {
  BlogPost,
  BlogPostCategory,
  StrapiBlogPost,
  StrapiBlogPostCategory,
  StrapiUploadFile,
} from './types';

function asString(value: unknown) {
  return typeof value === 'string' ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === 'number' ? value : null;
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
