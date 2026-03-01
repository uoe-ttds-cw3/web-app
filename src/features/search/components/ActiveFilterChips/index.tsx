import { Box, Icon, Text } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

export type ActiveFilterChipsProps = {
  decision?: string;
  deviceClass?: string;
  panel?: string;
  productCode?: string;
  onRemove: (field: string) => void;
};

type ChipConfig = {
  field: string;
  label: string;
  value?: string;
};

export const ActiveFilterChips = ({
  decision,
  deviceClass,
  panel,
  productCode,
  onRemove,
}: ActiveFilterChipsProps) => {
  const chips: ChipConfig[] = [
    { field: "decision", label: "Decision", value: decision },
    { field: "device_class", label: "Class", value: deviceClass },
    { field: "panel", label: "Panel", value: panel },
    { field: "product_code", label: "Product", value: productCode },
  ].filter((chip): chip is ChipConfig & { value: string } => Boolean(chip.value));

  if (chips.length === 0) {
    return null;
  }

  return (
    <Box display="flex" gap="2" marginBottom="4" flexWrap="wrap">
      {chips.map((chip) => (
        <Box
          key={chip.field}
          display="inline-flex"
          alignItems="center"
          gap="2"
          padding="6px 12px"
          backgroundColor="brand.accentBg"
          color="brand.primary"
          borderRadius="16px"
          fontSize="sm"
        >
          <Text>
            {chip.label}: {chip.value}
          </Text>
          <Box
            as="button"
            onClick={() => onRemove(chip.field)}
            cursor="pointer"
            display="flex"
            alignItems="center"
          >
            <Icon as={FaTimes} boxSize="3" />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
