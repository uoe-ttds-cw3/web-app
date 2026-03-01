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

const RED_BADGE_STYLES = {
  color: "red.600",
  borderColor: "red.600",
};

const ORANGE_BADGE_STYLES = {
  color: "orange.600",
  borderColor: "orange.600",
};

export const SafetySignals = ({ device }: SafetySignalsProps) => {
  const hasRecalls = device.recalls != null && device.recalls > 0;
  const hasAdverseEvents =
    device.adverseEvents != null && device.adverseEvents > 0;

  if (!hasRecalls && !hasAdverseEvents) {
    return null;
  }

  return (
    <HStack gap="2" flexWrap="wrap" alignItems="center">
      <Text fontSize="xs" color="ui.textMuted">
        Safety Signals
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
      {hasAdverseEvents && (
        <Tooltip
          content={`${device.adverseEvents?.toLocaleString()} reported adverse events for this device in the cached FDA MAUDE data`}
          showArrow
          openDelay={200}
          contentProps={TOOLTIP_PROPS}
        >
          <Badge
            colorPalette={device.adverseEvents! >= 100 ? "red" : "orange"}
            variant="outline"
            fontSize="xs"
            flexShrink={0}
            cursor="help"
            padding="0 0.25rem"
            {...(device.adverseEvents! >= 100 ? RED_BADGE_STYLES : ORANGE_BADGE_STYLES)}
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
            variant="outline"
            fontSize="xs"
            flexShrink={0}
            cursor="help"
            padding="0 0.25rem"
            {...RED_BADGE_STYLES}
          >
            {device.recalls} recall{device.recalls === 1 ? "" : "s"}
          </Badge>
        </Tooltip>
      )}
    </HStack>
  );
};
