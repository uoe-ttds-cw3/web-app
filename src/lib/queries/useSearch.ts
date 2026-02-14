import { queryOptions, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { apiFetch } from '@/lib/api/client';
import type { SearchResponse, SearchFilters } from '@/lib/api/types';

export const searchQueryOptions = (query: string, filters?: SearchFilters) =>
  queryOptions({
    queryKey: queryKeys.search.list({ query, ...filters }),
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({ q: query });
      if (filters?.limit) params.set('limit', String(filters.limit));
      if (filters?.offset) params.set('offset', String(filters.offset));
      if (filters?.panel) params.set('panel', filters.panel);
      if (filters?.product_code) params.set('product_code', filters.product_code);
      if (filters?.date_from) params.set('date_from', filters.date_from);
      if (filters?.date_to) params.set('date_to', filters.date_to);
      if (filters?.decision) params.set('decision', filters.decision);
      if (filters?.device_class) params.set('device_class', filters.device_class);
      if (filters?.use_expansion) params.set('use_expansion', 'true');
      if (filters?.use_pagerank_boost) params.set('use_pagerank_boost', 'true');
      if (filters?.include_facets) params.set('include_facets', 'true');

      return apiFetch<SearchResponse>(`/api/search?${params}`, { signal });
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: query.length > 0,
  });

export const useSearch = (query: string, filters?: SearchFilters) => {
  return useQuery(searchQueryOptions(query, filters));
};
