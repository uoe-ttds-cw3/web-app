import { Box } from "@chakra-ui/react";
import type { DeviceLookupResponse, DeviceSafetyData } from "@/lib/api/types";
import { FeatureSignalsSection } from "./FeatureSignalsSection";
import { MaterialsSection } from "./MaterialsSection";
import { SafetySignalsSection } from "./SafetySignalsSection";

export type DeviceSignalsSummaryBoxProps = {
  device: DeviceLookupResponse;
  deviceSafety: DeviceSafetyData | null;
};

export const DeviceSignalsSummaryBox = ({
  device,
  deviceSafety,
}: DeviceSignalsSummaryBoxProps) => {
  const hasFeatureSignals =
    device.has_clinical_data ||
    device.has_sterilization ||
    device.has_biocompatibility ||
    device.has_software ||
    device.has_electrical_safety;
  const hasMaterials = device.materials.length > 0;
  const hasSafetySignals = !!deviceSafety && deviceSafety.recall_count > 0;

  if (!hasFeatureSignals && !hasMaterials && !hasSafetySignals) {
    return null;
  }

  return (
    <Box
      marginBottom="24px"
      p={{ base: 3, md: 4 }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      display="grid"
      gap={{ base: 3, md: 4 }}
    >
      <MaterialsSection device={device} />
      <FeatureSignalsSection device={device} />
      <SafetySignalsSection deviceSafety={deviceSafety} />
    </Box>
  );
};
