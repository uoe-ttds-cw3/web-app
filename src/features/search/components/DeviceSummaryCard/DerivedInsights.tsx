import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";
import { FeatureBadges } from "./FeatureBadges";
import { MaterialsRow } from "./MaterialsRow";

export type DerivedInsightsProps = {
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
    <Box p="2" border="1px solid" borderColor="gray.200" borderRadius="md">
      <HStack gap="1" mb="2" alignItems="center">
        <Text fontSize="xs" color="ui.textMuted" textTransform="uppercase">
          Derived insights
        </Text>
        <Tooltip
          content="Feature signals and materials are inferred from keyword and pattern matches in the submission text."
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
            aria-label="How derived insights are detected"
          >
            <Icon as={LuInfo} boxSize="3.5" />
          </Box>
        </Tooltip>
      </HStack>
      {hasDerivedFeatures && (
        <HStack alignItems="flex-start" gap="2" flexWrap="wrap">
          <Text fontSize="xs" color="ui.textMuted" pt="1">
            Detected signals
          </Text>
          <FeatureBadges device={device} />
        </HStack>
      )}
      {hasMaterials && (
        <HStack
          mt={hasDerivedFeatures ? "3" : "0"}
          alignItems="flex-start"
          gap="2"
          flexWrap="wrap"
        >
          <Text fontSize="xs" color="ui.textMuted" pt="1">
            Extracted materials
          </Text>
          <MaterialsRow device={device} />
        </HStack>
      )}
    </Box>
  );
};
