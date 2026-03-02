import { Badge, Box, Button, HStack, Icon, Text } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import type { DeviceLookupResponse } from "@/lib/api/types";

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
  maxW: "320px",
};

export type MaterialsSectionProps = {
  device: DeviceLookupResponse;
};

export const MaterialsSection = ({ device }: MaterialsSectionProps) => {
  if (device.materials.length === 0) {
    return null;
  }

  const visibleMaterials = device.materials.slice(0, 4);
  const hiddenCount = device.materials.length - visibleMaterials.length;

  return (
    <Box>
      <HStack gap="2" alignItems="center" marginBottom="2">
        <Text fontSize="sm" color="brand.primary" fontWeight="semibold">
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
      </HStack>
      <HStack gap="2" flexWrap="wrap" alignItems="center">
        {visibleMaterials.map((material) => (
          <Badge key={material} variant="subtle" colorPalette="gray" fontSize="xs">
            {material}
          </Badge>
        ))}
        {hiddenCount > 0 && (
          <Badge variant="outline" colorPalette="gray" fontSize="xs">
            +{hiddenCount} more
          </Badge>
        )}
      </HStack>
    </Box>
  );
};
