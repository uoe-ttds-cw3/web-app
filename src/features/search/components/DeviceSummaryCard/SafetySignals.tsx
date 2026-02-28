import { Badge, Box, HStack, Text } from "@chakra-ui/react";
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
};

export const SafetySignals = ({ device }: SafetySignalsProps) => {
  const hasRecalls = device.recalls != null && device.recalls > 0;
  const hasAdverseEvents =
    device.adverseEvents != null && device.adverseEvents > 0;

  if (!hasRecalls && !hasAdverseEvents) {
    return null;
  }

  return (
    <Box mt="4">
      <Text fontSize="xs" color="ui.textMuted" textTransform="uppercase" mb="2">
        Safety signals
      </Text>
      <HStack gap="2" flexWrap="wrap">
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
