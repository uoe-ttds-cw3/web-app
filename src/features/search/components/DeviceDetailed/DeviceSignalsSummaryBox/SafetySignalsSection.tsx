import { Badge, Box, HStack, Icon, Text } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import type { DeviceSafetyData } from "@/lib/api/types";

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

export type SafetySignalsSectionProps = {
  deviceSafety: DeviceSafetyData | null;
};

export const SafetySignalsSection = ({
  deviceSafety,
}: SafetySignalsSectionProps) => {
  const hasRecalls = !!deviceSafety && deviceSafety.recall_count > 0;
  const hasAdverseEvents = !!deviceSafety && deviceSafety.event_count > 0;

  if ((!hasRecalls && !hasAdverseEvents) || !deviceSafety) {
    return null;
  }

  return (
    <Box>
      <HStack gap="2" alignItems="center" marginBottom="2">
        <Text fontSize="sm" color="brand.primary" fontWeight="semibold">
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
      </HStack>
      <HStack gap="2" flexWrap="wrap" alignItems="center">
        {hasAdverseEvents && (
          <Tooltip
            content={`${deviceSafety.event_count.toLocaleString()} reported adverse events for this device in the cached FDA MAUDE data`}
            showArrow
            openDelay={200}
            contentProps={TOOLTIP_PROPS}
          >
            <Badge
              colorPalette={deviceSafety.event_count >= 100 ? "red" : "orange"}
              variant="outline"
              fontSize="xs"
              flexShrink={0}
              cursor="help"
              padding="0 0.25rem"
              {...(deviceSafety.event_count >= 100
                ? RED_BADGE_STYLES
                : ORANGE_BADGE_STYLES)}
            >
              {deviceSafety.event_count.toLocaleString()} adverse events
            </Badge>
          </Tooltip>
        )}
        {hasRecalls && (
          <Tooltip
            content={`${deviceSafety.recall_count} recall(s) associated with this device in the cached FDA recall data`}
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
              {deviceSafety.recall_count} recall
              {deviceSafety.recall_count === 1 ? "" : "s"}
            </Badge>
          </Tooltip>
        )}
      </HStack>
    </Box>
  );
};
