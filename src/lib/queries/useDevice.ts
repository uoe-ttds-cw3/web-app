import { queryOptions, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { apiFetch } from '@/lib/api/client';
import type { DeviceLookupResponse, LineageResponse, SafetyProfileResponse, DeviceSafetyData } from '@/lib/api/types';

type DevicePageData = {
  device: DeviceLookupResponse | null;
  lineage: LineageResponse | null;
  safety: SafetyProfileResponse | null;
  deviceSafety: DeviceSafetyData | null;
};

export const deviceQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.device.detail(id),
    queryFn: async ({ signal }) => {
      return apiFetch<DevicePageData>(`/api/device/${encodeURIComponent(id)}`, { signal });
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: id.length > 0,
  });

export const useDevice = (id: string) => {
  return useQuery(deviceQueryOptions(id));
};
