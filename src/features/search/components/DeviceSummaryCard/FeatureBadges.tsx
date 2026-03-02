import { Badge, HStack } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/Tooltip";
import { FEATURE_SIGNAL_CONFIG } from "@/features/search/components/DeviceShared/featureSignalConfig";
import type { Device } from "@/lib/api/types";

export type FeatureBadgesProps = {
  device: Device;
};

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
};

const FEATURE_BADGE_STYLES = {
  color: "gray.700",
  borderColor: "gray.500",
  fontWeight: "600",
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
    <HStack gap="2" flexWrap="wrap" alignItems="center">
      {FEATURE_SIGNAL_CONFIG.map((feature) => {
        if (!device[feature.summaryKey]) {
          return null;
        }

        return (
          <Tooltip
            key={feature.summaryKey}
            content={feature.tooltip}
            showArrow
            openDelay={200}
            contentProps={TOOLTIP_PROPS}
          >
            <Badge
              variant="outline"
              colorPalette="gray"
              fontSize="xs"
              cursor="help"
              padding="0 0.25rem"
              {...FEATURE_BADGE_STYLES}
            >
              {feature.label}
            </Badge>
          </Tooltip>
        );
      })}
    </HStack>
  );
};
