import { Box } from "@chakra-ui/react";
import type { Device } from "@/lib/api/types";
import { FeatureSignalsRow } from "./FeatureSignalsRow";
import { MaterialsSignalsRow } from "./MaterialsSignalsRow";
import { SafetySignals } from "./SafetySignals";

export type SignalSummaryBoxProps = {
  device: Device;
};

export const SignalSummaryBox = ({ device }: SignalSummaryBoxProps) => {
  const hasFeatureSignals =
    device.hasClinicalData ||
    device.hasSterilization ||
    device.hasBiocompatibility ||
    device.hasSoftware ||
    device.hasElectricalSafety;
  const hasMaterials = device.materials.length > 0;
  const hasSafetySignals =
    (device.recalls != null && device.recalls > 0) ||
    (device.adverseEvents != null && device.adverseEvents > 0);

  if (!hasFeatureSignals && !hasMaterials && !hasSafetySignals) {
    return null;
  }

  return (
    <Box
      p={{ base: 3, md: 2 }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      display="grid"
      gap={{ base: 2, md: 3 }}
    >
      <FeatureSignalsRow device={device} />
      <MaterialsSignalsRow device={device} />
      <SafetySignals device={device} />
    </Box>
  );
};
