/**
 * Query key factory for React Query
 * Provides centralized, type-safe keys for all endpoints
 */

import type { SearchFilters } from './types';

export const queryKeys = {
  search: {
    all: ['search'] as const,
    lists: () => [...queryKeys.search.all, 'list'] as const,
    list: (filters: SearchFilters & { query: string }) =>
      [...queryKeys.search.lists(), filters] as const,
  },
  autocomplete: {
    all: ['autocomplete'] as const,
    query: (q: string) => [...queryKeys.autocomplete.all, q] as const,
  },
  panels: {
    all: ['panels'] as const,
  },
  device: {
    all: ['device'] as const,
    detail: (id: string) => [...queryKeys.device.all, id] as const,
    lineage: (id: string) => [...queryKeys.device.detail(id), 'lineage'] as const,
    safety: (code: string) => [...queryKeys.device.all, 'safety', code] as const,
  },
} as const;
