import 'server-only';
import { strapi } from '@strapi/client';

const DEFAULT_STRAPI_BASE_URL = 'http://localhost:1337';

function normalizeBaseUrl(value: string) {
  const url = new URL(value);
  url.pathname = url.pathname.replace(/\/$/, '');
  return url.toString().replace(/\/$/, '');
}

const STRAPI_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_STRAPI_URL ?? DEFAULT_STRAPI_BASE_URL,
);
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN?.trim();

console.log('[strapi] base URL:', STRAPI_BASE_URL);
console.log('[strapi] token present:', !!STRAPI_API_TOKEN);

export const strapiClient = strapi({
  baseURL: new URL('./api', `${STRAPI_BASE_URL}/`).toString(),
  ...(STRAPI_API_TOKEN ? { auth: STRAPI_API_TOKEN } : {}),
});

export function toAbsoluteStrapiUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return new URL(path, `${STRAPI_BASE_URL}/`).toString();
}
