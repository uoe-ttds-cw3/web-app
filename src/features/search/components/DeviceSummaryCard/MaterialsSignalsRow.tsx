import { Button, HStack, Icon, Text } from "@chakra-ui/react";
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
          aria-label="How materials are extracted"
        >
          <Icon as={LuInfo} boxSize="3.5" />
        </Button>
      </Tooltip>
      <MaterialsRow device={device} />
    </HStack>
  );
};
