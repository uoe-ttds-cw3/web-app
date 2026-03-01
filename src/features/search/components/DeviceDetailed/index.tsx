import { Box, Separator } from "@chakra-ui/react";
import { DeviceDetailCard } from "./DeviceDetailCard";
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
    <Box display="grid" gap="16px">
      <DeviceDetailCard>
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
      </DeviceDetailCard>

      <DeviceDetailCard title="Safety">
        <DeviceSafetyOverview
          device={device}
          deviceSafety={deviceSafety}
          formatDate={formatDate}
          formatNumber={formatNumber}
        />

        <ProductCodeSafetySection
          safety={safety}
          deviceSafety={deviceSafety}
          productCode={device.product_code}
        />
      </DeviceDetailCard>

      <DeviceDetailCard title="Relationships">
        <DeviceLineageSection lineage={lineage} device={device} />

        <ManufacturerDevicesSection device={device} />

        <SimilarDevicesSection device={device} />
      </DeviceDetailCard>
    </Box>
  );
};
