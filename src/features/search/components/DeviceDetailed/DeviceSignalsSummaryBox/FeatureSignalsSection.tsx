import { Badge, Box, HStack, Icon, Text } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import { FEATURE_SIGNAL_CONFIG } from "@/features/search/components/DeviceShared/featureSignalConfig";
import type { DeviceLookupResponse } from "@/lib/api/types";

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
  maxW: "320px",
};

export type FeatureSignalsSectionProps = {
  device: DeviceLookupResponse;
};

export const FeatureSignalsSection = ({
  device,
}: FeatureSignalsSectionProps) => {
  const hasFeatureSignals = FEATURE_SIGNAL_CONFIG.some(
    (feature) => device[feature.detailedKey],
  );

  if (!hasFeatureSignals) {
    return null;
  }

  return (
    <Box>
      <HStack gap="2" alignItems="center" marginBottom="2">
        <Text fontSize="sm" color="brand.primary" fontWeight="semibold">
          Feature Signals
        </Text>
        <Tooltip
          content="Feature signals are boolean indicators inferred from keyword and pattern matches in the submission text."
          showArrow
          openDelay={200}
          contentProps={TOOLTIP_PROPS}
        >
          <Box
            color="ui.textMuted"
            cursor="help"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            aria-label="How feature signals are detected"
          >
            <Icon as={LuInfo} boxSize="3.5" />
          </Box>
        </Tooltip>
      </HStack>
      <HStack gap="2" flexWrap="wrap" alignItems="center">
        {FEATURE_SIGNAL_CONFIG.map((feature) => {
          if (!device[feature.detailedKey]) {
            return null;
          }

          return (
            <Tooltip
              key={feature.detailedKey}
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
              >
                {feature.label}
              </Badge>
            </Tooltip>
          );
        })}
      </HStack>
    </Box>
  );
};
