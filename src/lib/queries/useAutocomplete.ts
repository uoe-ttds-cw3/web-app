import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { queryKeys } from '@/lib/api/queryKeys';
import { apiFetch } from '@/lib/api/client';
import type { AutocompleteResponse } from '@/lib/api/types';

export const useAutocomplete = (query: string, debounceMs = 150) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  return useQuery({
    queryKey: queryKeys.autocomplete.query(debouncedQuery),
    queryFn: async ({ signal }) => {
      return apiFetch<AutocompleteResponse>(
        `/api/autocomplete?q=${encodeURIComponent(debouncedQuery)}&limit=8`,
        { signal }
      );
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 60, // 1 hour (suggestions are static)
  });
};
