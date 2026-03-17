'use client';

import { useMemo } from 'react';
import { useTheme } from 'next-themes';

export const CHART_STATUS_COLORS = {
  destroyed: '#e11d48',
  damaged: '#f97316',
  captured: '#2563eb',
  abandoned: '#71717a',
} as const;

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return useMemo(
    () => ({
      grid: isDark ? '#27272a' : '#d8cfc7',
      axis: isDark ? '#90909b' : '#66606a',
      tooltipStyle: {
        backgroundColor: isDark ? '#0b0b0d' : '#fbf7f2',
        border: `1px solid ${isDark ? '#202025' : '#d8cfc7'}`,
        borderRadius: '0.5rem',
        color: isDark ? '#fafafa' : '#18181b',
      },
    }),
    [isDark],
  );
}
