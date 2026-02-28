import { Box, Text } from "@chakra-ui/react";
import type { Device } from "@/lib/api/types";

export type MaterialsRowProps = {
  device: Device;
};

export const MaterialsRow = ({ device }: MaterialsRowProps) => {
  if (device.materials.length === 0) {
    return null;
  }

  return (
    <Text fontSize="sm" color="ui.textMuted" mb="3">
      <Box as="span" fontWeight="medium">
        Materials:
      </Box>{" "}
      {device.materials.join(" · ")}
    </Text>
  );
};
