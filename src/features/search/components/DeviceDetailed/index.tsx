import { Box, Heading, Badge, Separator, Card, HStack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { DeviceDescriptionSection } from "./DeviceDescriptionSection";
import { DeviceHeader } from "./DeviceHeader";
import { DeviceLineageSection } from "./DeviceLineageSection";
import { DeviceMetadata } from "./DeviceMetadata";
import { DeviceSafetyOverview } from "./DeviceSafetyOverview";
import { DeviceSignalsSummaryBox } from "./DeviceSignalsSummaryBox";
import { DeviceSummarySection } from "./DeviceSummarySection";
import { IndicationsForUseSection } from "./IndicationsForUseSection";
import { ProductCodeSafetySection } from "./ProductCodeSafetySection";
import { RelatedDevicesSection } from "./RelatedDevicesSection";
import { StandardsReferencedSection } from "./StandardsReferencedSection";
import { SterilizationMethodsSection } from "./SterilizationMethodsSection";
import { formatDate, formatNumber } from "./utils";
import { useSearch } from "@/lib/queries/useSearch";
import type {
  DeviceLookupResponse,
  LineageResponse,
  SafetyProfileResponse,
  DeviceSafetyData,
} from "@/lib/api/types";

type DeviceDetailedProps = {
  device: DeviceLookupResponse;
  lineage: LineageResponse | null;
  safety: SafetyProfileResponse | null;
  deviceSafety: DeviceSafetyData | null;
};

export const DeviceDetailed = ({
  device,
  lineage,
  safety,
  deviceSafety,
}: DeviceDetailedProps) => {
  const router = useRouter();

  // fetch related devices from same manufacturer
  const { data: manufacturerDevices, isLoading: isLoadingManufacturer } =
    useSearch(device.sponsor || "", { limit: 6 });

  // fetch similar devices with same product code using filter, not free-text
  const { data: similarDevices, isLoading: isLoadingSimilar } = useSearch(
    device.device_name || "",
    { limit: 6, product_code: device.product_code || undefined },
  );

  // filter out current device from manufacturer results
  const filteredManufacturerDevices = useMemo(() => {
    if (!manufacturerDevices?.results) return [];
    return manufacturerDevices.results
      .filter((d) => d.submission_number !== device.submission_number)
      .slice(0, 5);
  }, [manufacturerDevices, device.submission_number]);

  // filter out current device from similar results
  const filteredSimilarDevices = useMemo(() => {
    if (!similarDevices?.results) return [];
    return similarDevices.results
      .filter((d) => d.submission_number !== device.submission_number)
      .slice(0, 5);
  }, [similarDevices, device.submission_number]);

  return (
    <Card.Root
      backgroundColor="white"
      padding={{ base: "16px", md: "24px" }}
      borderRadius="12px"
      maxWidth="1200px"
      borderWidth="1px"
      borderColor="ui.border"
    >
      <DeviceHeader device={device} deviceSafety={deviceSafety} />

      <Separator marginY="16px" />

      <DeviceMetadata device={device} formatDate={formatDate} />

      <Separator marginY="16px" />

      <DeviceSignalsSummaryBox device={device} deviceSafety={deviceSafety} />

      <IndicationsForUseSection device={device} />

      <DeviceDescriptionSection device={device} />

      <StandardsReferencedSection device={device} />

      <SterilizationMethodsSection device={device} />

      <DeviceSummarySection device={device} />

      {/* lineage section */}
      {lineage && (
        <>
          <Separator marginY="16px" />
          <DeviceLineageSection lineage={lineage} device={device} />
        </>
      )}

      {/* device-specific safety section */}
      {deviceSafety &&
        (deviceSafety.event_count > 0 || deviceSafety.recall_count > 0) && (
          <>
            <Separator marginY="16px" />
            <DeviceSafetyOverview
              device={device}
              deviceSafety={deviceSafety}
              formatDate={formatDate}
              formatNumber={formatNumber}
            />
          </>
        )}

      {/* product-code safety section (aggregate for all devices with this product code) */}
      {safety && (
        <>
          <Separator marginY="16px" />
          <ProductCodeSafetySection
            safety={safety}
            deviceSafety={deviceSafety}
            productCode={device.product_code}
          />
        </>
      )}

      {/* related devices from manufacturer */}
      {(isLoadingManufacturer || filteredManufacturerDevices.length > 0) && (
        <>
          <Separator marginY="16px" />
          <RelatedDevicesSection
            title={`More from ${device.sponsor}`}
            devices={filteredManufacturerDevices}
            isLoading={isLoadingManufacturer}
            onDeviceClick={(relatedDevice) => {
              posthog.capture("related_manufacturer_device_clicked", {
                from_device_id: device.submission_number,
                from_device_name: device.device_name,
                to_device_id: relatedDevice.submission_number,
                to_device_name: relatedDevice.device_name,
              });
              router.push(`/devices/${relatedDevice.submission_number}`);
            }}
          />
        </>
      )}

      {/* similar devices with same product code */}
      {(isLoadingSimilar || filteredSimilarDevices.length > 0) && (
        <>
          <Separator marginY="16px" />
          <RelatedDevicesSection
            title="Similar Devices"
            subtitle={`Devices with Product Code: ${device.product_code}`}
            devices={filteredSimilarDevices}
            isLoading={isLoadingSimilar}
            showSponsor
            onDeviceClick={(relatedDevice) => {
              posthog.capture("related_similar_device_clicked", {
                from_device_id: device.submission_number,
                from_device_name: device.device_name,
                to_device_id: relatedDevice.submission_number,
                to_device_name: relatedDevice.device_name,
                product_code: device.product_code,
              });
              router.push(`/devices/${relatedDevice.submission_number}`);
            }}
          />
        </>
      )}
    </Card.Root>
  );
};
