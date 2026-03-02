import { Button, HStack, Icon, Text } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";
import { FeatureBadges } from "./FeatureBadges";

export type FeatureSignalsRowProps = {
  device: Device;
};

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
  maxW: "320px",
};

export const FeatureSignalsRow = ({ device }: FeatureSignalsRowProps) => {
  const hasFeatureSignals =
    device.hasClinicalData ||
    device.hasSterilization ||
    device.hasBiocompatibility ||
    device.hasSoftware ||
    device.hasElectricalSafety;

  if (!hasFeatureSignals) {
    return null;
  }

  return (
    <HStack gap="2" flexWrap="wrap" alignItems="center">
      <Text fontSize="xs" color="ui.textMuted">
        Feature Signals
      </Text>
      <Tooltip
        content="Feature signals are boolean indicators inferred from keyword and pattern matches in the submission text."
        showArrow
        openDelay={200}
        contentProps={TOOLTIP_PROPS}
      >
        <Button
          type="button"
          color="ui.textMuted"
          cursor="help"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          bg="transparent"
          minW="unset"
          minH="unset"
          height="auto"
          p="0"
          _hover={{ bg: "transparent", color: "ui.text" }}
          _active={{ bg: "transparent" }}
          aria-label="How feature signals are detected"
        >
          <Icon as={LuInfo} boxSize="3.5" />
        </Button>
      </Tooltip>
      <FeatureBadges device={device} />
    </HStack>
  );
};
