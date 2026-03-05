import { Box, Icon, Text } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import type { FacetField } from "@/lib/api/types";
import { getFacetDisplayValue } from "@/features/search/utils/filterDisplay";

export type ActiveFilterChipsProps = {
  decision?: string;
  deviceClass?: string;
  panel?: string;
  productCode?: string;
  facets?: FacetField[] | null;
  onRemove: (field: string) => void;
};

type ChipConfig = {
  field: string;
  facetField: string;
  label: string;
  value?: string;
};

export const ActiveFilterChips = ({
  decision,
  deviceClass,
  panel,
  productCode,
  facets,
  onRemove,
}: ActiveFilterChipsProps) => {
  const chipConfigs: ChipConfig[] = [
    {
      field: "decision",
      facetField: "decision_code",
      label: "Decision",
      value: decision,
    },
    {
      field: "device_class",
      facetField: "device_class",
      label: "Device Class",
      value: deviceClass,
    },
    {
      field: "panel",
      facetField: "panel_code",
      label: "Panel (Category)",
      value: panel,
    },
    {
      field: "product_code",
      facetField: "product_code",
      label: "Product Code",
      value: productCode,
    },
  ];

  const chips = chipConfigs
    .map((chip) => ({
      ...chip,
      value: getFacetDisplayValue(facets, chip.facetField, chip.value),
    }))
    .filter((chip): chip is ChipConfig & { value: string } => Boolean(chip.value));

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
