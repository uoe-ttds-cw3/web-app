import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";
import { MaterialsRow } from "./MaterialsRow";

export type MaterialsSignalsRowProps = {
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

export const MaterialsSignalsRow = ({ device }: MaterialsSignalsRowProps) => {
  if (device.materials.length === 0) {
    return null;
  }

  return (
    <HStack gap="2" flexWrap="wrap" alignItems="center">
      <Text fontSize="xs" color="ui.textMuted">
        Materials
      </Text>
      <Tooltip
        content="Materials are extracted from the submission text and may be incomplete."
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
          aria-label="How materials are extracted"
        >
          <Icon as={LuInfo} boxSize="3.5" />
        </Box>
      </Tooltip>
      <MaterialsRow device={device} />
    </HStack>
  );
};
