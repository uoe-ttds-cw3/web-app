import { Separator } from "@chakra-ui/react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { RelatedDevicesSection } from "./RelatedDevicesSection";
import { buildDeviceDetailsHref, getSearchResultsHref } from "@/lib/navigation";
import { useSearch } from "@/lib/queries/useSearch";
import type { DeviceLookupResponse } from "@/lib/api/types";

export type SimilarDevicesSectionProps = {
  device: DeviceLookupResponse;
};

export const SimilarDevicesSection = ({ device }: SimilarDevicesSectionProps) => {
  const router = useRouter();
  const searchResultsHref = getSearchResultsHref(router.query.returnTo);
  const { data: similarDevices, isLoading } = useSearch(device.device_name || "", {
    limit: 6,
    product_code: device.product_code || undefined,
  });

  const filteredDevices = useMemo(() => {
    if (!similarDevices?.results) {
      return [];
    }

    return similarDevices.results
      .filter((d) => d.submission_number !== device.submission_number)
      .slice(0, 5);
  }, [device.submission_number, similarDevices]);

  if (!isLoading && filteredDevices.length === 0) {
    return null;
  }

  return (
    <>
      <Separator marginY="16px" />
      <RelatedDevicesSection
        title="Similar Devices"
        subtitle={`Devices with Product Code: ${device.product_code}`}
        devices={filteredDevices}
        isLoading={isLoading}
        showSponsor
        onDeviceClick={(relatedDevice) => {
          posthog.capture("related_similar_device_clicked", {
            from_device_id: device.submission_number,
            from_device_name: device.device_name,
            to_device_id: relatedDevice.submission_number,
            to_device_name: relatedDevice.device_name,
            product_code: device.product_code,
          });
          router.push(
            buildDeviceDetailsHref(
              relatedDevice.submission_number,
              searchResultsHref,
            ),
          );
        }}
      />
    </>
  );
};
