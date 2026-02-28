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
    <HStack gap="2" flexWrap="wrap">
      {device.hasClinicalData && (
        <Badge variant="subtle" colorPalette="gray" fontSize="xs">
          Clinical data detected
        </Badge>
      )}
      {device.hasSterilization && (
        <Badge variant="subtle" colorPalette="gray" fontSize="xs">
          Sterilization detected
        </Badge>
      )}
      {device.hasBiocompatibility && (
        <Badge variant="subtle" colorPalette="gray" fontSize="xs">
          Biocompatibility detected
        </Badge>
      )}
      {device.hasSoftware && (
        <Badge variant="subtle" colorPalette="gray" fontSize="xs">
          Software detected
        </Badge>
      )}
      {device.hasElectricalSafety && (
        <Badge variant="subtle" colorPalette="gray" fontSize="xs">
          Electrical safety detected
        </Badge>
      )}
    </HStack>
  );
};
