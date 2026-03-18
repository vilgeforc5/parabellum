'use server';

import { getConflictAnalyticsSectionData } from '@/lib/strapi';

export async function fetchConflictAnalytics(conflictSlug?: string) {
  return getConflictAnalyticsSectionData(conflictSlug);
}
