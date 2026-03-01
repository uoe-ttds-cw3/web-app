import { Badge, HStack } from "@chakra-ui/react";
import type { Device } from "@/lib/api/types";

export type MaterialsRowProps = {
  device: Device;
};

export const MaterialsRow = ({ device }: MaterialsRowProps) => {
  if (device.materials.length === 0) {
    return null;
  }

  const visibleMaterials = device.materials.slice(0, 4);
  const hiddenCount = device.materials.length - visibleMaterials.length;

  return (
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
  );
};
