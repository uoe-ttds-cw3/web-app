import { Box, Heading, Badge, Separator, Card, HStack } from "@chakra-ui/react";
import { DeviceDescriptionSection } from "./DeviceDescriptionSection";
import { DeviceHeader } from "./DeviceHeader";
import { DeviceLineageSection } from "./DeviceLineageSection";
import { DeviceMetadata } from "./DeviceMetadata";
import { DeviceSafetyOverview } from "./DeviceSafetyOverview";
import { DeviceSignalsSummaryBox } from "./DeviceSignalsSummaryBox";
import { ManufacturerDevicesSection } from "./ManufacturerDevicesSection";
import { DeviceSummarySection } from "./DeviceSummarySection";
import { IndicationsForUseSection } from "./IndicationsForUseSection";
import { ProductCodeSafetySection } from "./ProductCodeSafetySection";
import { SimilarDevicesSection } from "./SimilarDevicesSection";
import { StandardsReferencedSection } from "./StandardsReferencedSection";
import { SterilizationMethodsSection } from "./SterilizationMethodsSection";
import { formatDate, formatNumber } from "./utils";
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

      <ManufacturerDevicesSection device={device} />

      <SimilarDevicesSection device={device} />
    </Card.Root>
  );
};
