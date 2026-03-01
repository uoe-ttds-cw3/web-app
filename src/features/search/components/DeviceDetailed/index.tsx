import { Box, Separator, Tabs } from "@chakra-ui/react";
import { DEVICE_DETAIL_MAX_W } from "./DeviceDetailCard";
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
    <Box width="100%" maxW={DEVICE_DETAIL_MAX_W} mx="auto">
      <Tabs.Root defaultValue="overview" lazyMount unmountOnExit variant="line">
        <Box
          backgroundColor="white"
          borderWidth="1px"
          borderColor="ui.border"
          borderRadius="12px"
          overflow="hidden"
        >
          <Box
            px={{ base: "16px", md: "24px" }}
            pt={{ base: "12px", md: "16px" }}
          >
            <Tabs.List>
              <Tabs.Trigger value="overview" px={{ base: "4", md: "5" }}>
                Overview
              </Tabs.Trigger>
              <Tabs.Trigger value="safety" px={{ base: "4", md: "5" }}>
                Safety
              </Tabs.Trigger>
              <Tabs.Trigger value="relationships" px={{ base: "4", md: "5" }}>
                Relationships
              </Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
          </Box>

          <Box
            px={{ base: "16px", md: "24px" }}
            pb={{ base: "16px", md: "24px" }}
          >
            <Tabs.Content value="overview">
              <Box pt="16px">
                <DeviceHeader device={device} deviceSafety={deviceSafety} />

                <Separator marginY="16px" />

                <DeviceMetadata device={device} formatDate={formatDate} />

                <Separator marginY="16px" />

                <DeviceSignalsSummaryBox
                  device={device}
                  deviceSafety={deviceSafety}
                />

                <IndicationsForUseSection device={device} />

                <DeviceDescriptionSection device={device} />

                <DeviceSummarySection device={device} />

                <StandardsReferencedSection device={device} />

                <SterilizationMethodsSection device={device} />
              </Box>
            </Tabs.Content>

            <Tabs.Content value="safety">
              <Box pt="16px">
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
              </Box>
            </Tabs.Content>

            <Tabs.Content value="relationships">
              <Box pt="16px">
                <DeviceLineageSection lineage={lineage} device={device} />

                <ManufacturerDevicesSection device={device} />

                <SimilarDevicesSection device={device} />
              </Box>
            </Tabs.Content>
          </Box>
        </Box>
      </Tabs.Root>
    </Box>
  );
};
