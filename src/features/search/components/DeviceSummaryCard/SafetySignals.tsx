import { Badge, Box, HStack, Icon, Text } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";

export type SafetySignalsProps = {
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

export const SafetySignals = ({ device }: SafetySignalsProps) => {
  const hasRecalls = device.recalls != null && device.recalls > 0;
  const hasAdverseEvents =
    device.adverseEvents != null && device.adverseEvents > 0;

  if (!hasRecalls && !hasAdverseEvents) {
    return null;
  }

  return (
    <Box p="2" border="1px solid" borderColor="gray.200" borderRadius="md">
      <HStack gap="1" mb="2" alignItems="center">
        <Text fontSize="xs" color="ui.textMuted" textTransform="uppercase">
          Safety signals
        </Text>
        <Tooltip
          content="These indicators come from cached FDA recall and MAUDE adverse-event data associated with this device."
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
            aria-label="How safety signals are calculated"
          >
            <Icon as={LuInfo} boxSize="3.5" />
          </Box>
        </Tooltip>
      </HStack>
      <HStack alignItems="center" gap="2" flexWrap="wrap">
        <Text fontSize="xs" color="ui.textMuted">
          Signals
        </Text>
        {hasAdverseEvents && (
          <Tooltip
            content={`${device.adverseEvents?.toLocaleString()} reported adverse events for this device in the cached FDA MAUDE data`}
            showArrow
            openDelay={200}
            contentProps={TOOLTIP_PROPS}
          >
            <Badge
              colorPalette={device.adverseEvents! >= 100 ? "red" : "orange"}
              variant="solid"
              fontSize="xs"
              flexShrink={0}
              cursor="help"
              padding="0 0.25rem"
            >
              {device.adverseEvents?.toLocaleString()} adverse events
            </Badge>
          </Tooltip>
        )}
        {hasRecalls && (
          <Tooltip
            content={`${device.recalls} recall(s) associated with this device in the cached FDA recall data`}
            showArrow
            openDelay={200}
            contentProps={TOOLTIP_PROPS}
          >
            <Badge
              colorPalette="red"
              variant="solid"
              fontSize="xs"
              flexShrink={0}
              cursor="help"
              padding="0 0.25rem"
            >
              {device.recalls} recall{device.recalls === 1 ? "" : "s"}
            </Badge>
          </Tooltip>
        )}
      </HStack>
    </Box>
  );
};
