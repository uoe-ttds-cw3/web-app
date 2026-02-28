import { Badge, HStack } from "@chakra-ui/react";
import type { Device } from "@/lib/api/types";

export type FeatureBadgesProps = {
  device: Device;
};

export const FeatureBadges = ({ device }: FeatureBadgesProps) => {
  const hasFeatureBadges =
    device.hasClinicalData ||
    device.hasSterilization ||
    device.hasBiocompatibility ||
    device.hasSoftware ||
    device.hasElectricalSafety;

  if (!hasFeatureBadges) {
    return null;
  }

  return (
    <HStack gap="2" flexWrap="wrap" mb="3">
      {device.hasClinicalData && (
        <Badge variant="subtle" colorPalette="gray" fontSize="xs">
          Clinical data
        </Badge>
      )}
      {device.hasSterilization && (
        <Badge variant="subtle" colorPalette="gray" fontSize="xs">
          Sterilization
        </Badge>
      )}
      {device.hasBiocompatibility && (
        <Badge variant="subtle" colorPalette="gray" fontSize="xs">
          Biocompatibility
        </Badge>
      )}
      {device.hasSoftware && (
        <Badge variant="subtle" colorPalette="gray" fontSize="xs">
          Software
        </Badge>
      )}
      {device.hasElectricalSafety && (
        <Badge variant="subtle" colorPalette="gray" fontSize="xs">
          Electrical safety
        </Badge>
      )}
    </HStack>
  );
};
