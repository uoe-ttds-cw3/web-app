import { Separator } from "@chakra-ui/react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { RelatedDevicesSection } from "./RelatedDevicesSection";
import { buildDeviceDetailsHref, getSearchResultsHref } from "@/lib/navigation";
import { useSearch } from "@/lib/queries/useSearch";
import type { DeviceLookupResponse } from "@/lib/api/types";

export type ManufacturerDevicesSectionProps = {
  device: DeviceLookupResponse;
};

export const ManufacturerDevicesSection = ({
  device,
}: ManufacturerDevicesSectionProps) => {
  const router = useRouter();
  const searchResultsHref = getSearchResultsHref(router.query.returnTo);
  const { data: manufacturerDevices, isLoading } = useSearch(device.sponsor || "", {
    limit: 6,
  });

  const filteredDevices = useMemo(() => {
    if (!manufacturerDevices?.results) {
      return [];
    }

    return manufacturerDevices.results
      .filter((d) => d.submission_number !== device.submission_number)
      .slice(0, 5);
  }, [device.submission_number, manufacturerDevices]);

  if (!isLoading && filteredDevices.length === 0) {
    return null;
  }

  return (
    <>
      <Separator marginY="16px" />
      <RelatedDevicesSection
        title={`More from ${device.sponsor}`}
        devices={filteredDevices}
        isLoading={isLoading}
        onDeviceClick={(relatedDevice) => {
          posthog.capture("related_manufacturer_device_clicked", {
            from_device_id: device.submission_number,
            from_device_name: device.device_name,
            to_device_id: relatedDevice.submission_number,
            to_device_name: relatedDevice.device_name,
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
