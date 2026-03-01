import { Badge, Box, Heading, HStack } from "@chakra-ui/react";
import { Tooltip as UiTooltip } from "@/components/ui/Tooltip";
import { FEATURE_SIGNAL_CONFIG } from "@/features/search/components/DeviceShared/featureSignalConfig";
import type { DeviceLookupResponse } from "@/lib/api/types";

const FEATURE_TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
};

export type DeviceFeatureSignalsProps = {
  device: DeviceLookupResponse;
};

export const DeviceFeatureSignals = ({
  device,
}: DeviceFeatureSignalsProps) => {
  return (
    <Box marginBottom="24px">
      <Heading size="md" color="brand.primary" marginBottom="12px">
        Feature Signals
      </Heading>
      <HStack gap="2" flexWrap="wrap" alignItems="center">
        {FEATURE_SIGNAL_CONFIG.map((feature) => {
          if (!device[feature.detailedKey]) {
            return null;
          }

          return (
            <UiTooltip
              key={feature.detailedKey}
              content={feature.tooltip}
              showArrow
              openDelay={200}
              contentProps={FEATURE_TOOLTIP_PROPS}
            >
              <Badge
                variant="outline"
                colorPalette="gray"
                fontSize="xs"
                cursor="help"
                padding="0 0.25rem"
              >
                {feature.label}
              </Badge>
            </UiTooltip>
          );
        })}
      </HStack>
    </Box>
  );
};
