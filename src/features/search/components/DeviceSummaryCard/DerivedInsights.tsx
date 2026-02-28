import { Box, Text } from "@chakra-ui/react";
import type { Device } from "@/lib/api/types";
import { FeatureBadges } from "./FeatureBadges";
import { MaterialsRow } from "./MaterialsRow";

export type DerivedInsightsProps = {
  device: Device;
};

export const DerivedInsights = ({ device }: DerivedInsightsProps) => {
  const hasDerivedFeatures =
    device.hasClinicalData ||
    device.hasSterilization ||
    device.hasBiocompatibility ||
    device.hasSoftware ||
    device.hasElectricalSafety;
  const hasMaterials = device.materials.length > 0;

  if (!hasDerivedFeatures && !hasMaterials) {
    return null;
  }

  return (
    <Box
      p="2"
      mb="4"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
    >
      <Text fontSize="xs" color="ui.textMuted" textTransform="uppercase" mb="2">
        Derived from submission text
      </Text>
      <FeatureBadges device={device} />
      <Box mt={hasDerivedFeatures && hasMaterials ? "2" : "0"}>
        <MaterialsRow device={device} />
      </Box>
    </Box>
  );
};
