import { Box, Button, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import type { FacetField } from "@/lib/api/types";

const FACET_LABELS: Record<string, string> = {
  device_class: "Device Class",
  panel_code: "Panel (Category)",
  decision_code: "Decision",
  product_code: "Product Code",
};

export type FiltersSidebarProps = {
  facets: FacetField[] | null;
  onFacetFilter: (field: string, value: string) => void;
};

export const FiltersSidebar = ({
  facets,
  onFacetFilter,
}: FiltersSidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const orderedFields = [
    "panel_code",
    "product_code",
    "device_class",
    "decision_code",
  ];
  const availableFacets =
    facets
      ?.filter((facet) => facet.total > 0 && facet.values.length > 0)
      .sort((a, b) => {
        const aIndex = orderedFields.indexOf(a.field);
        const bIndex = orderedFields.indexOf(b.field);
        const normalizedA = aIndex === -1 ? orderedFields.length : aIndex;
        const normalizedB = bIndex === -1 ? orderedFields.length : bIndex;
        return normalizedA - normalizedB;
      }) ?? [];

  const isSectionOpen = (field: string) =>
    openSections[field] ?? field === "panel_code";

  if (availableFacets.length === 0) {
    return null;
  }

  return (
    <Box
      backgroundColor="ui.background"
      border="1px solid"
      borderColor="ui.borderLight"
      borderRadius="12px"
      padding="3.5"
      height="fit-content"
      position={{ base: "static", md: "sticky" }}
      top={{ base: "auto", md: "112px" }}
    >
      <Text
        fontSize="xl"
        fontWeight="semibold"
        color="brand.primary"
        marginBottom="3"
      >
        Filters
      </Text>

      <Stack gap="3">
        {availableFacets.map((facet) => (
          <Box key={facet.field}>
            <Button
              variant="ghost"
              width="100%"
              justifyContent="space-between"
              fontSize="sm"
              fontWeight="semibold"
              color="brand.primary"
              paddingX="0"
              paddingY="0.5"
              minH="auto"
              onClick={() =>
                setOpenSections((prev) => ({
                  ...prev,
                  [facet.field]: !isSectionOpen(facet.field),
                }))
              }
            >
              <Text>{FACET_LABELS[facet.field] ?? facet.field}</Text>
              <Icon
                as={LuChevronDown}
                boxSize="4"
                transform={isSectionOpen(facet.field) ? "rotate(0deg)" : "rotate(-90deg)"}
                transition="transform 0.2s ease"
              />
            </Button>

            {isSectionOpen(facet.field) && (
              <Stack
                gap="0.5"
                marginTop="1"
                maxH="176px"
                overflowY="auto"
                paddingRight="1"
              >
                {facet.values.map((fv) => (
                  <Box
                    key={fv.value}
                    as="button"
                    onClick={() => onFacetFilter(facet.field, fv.value)}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    paddingX="2"
                    paddingY="1"
                    borderRadius="6px"
                    fontSize="sm"
                    _hover={{
                      backgroundColor: "ui.surface",
                    }}
                    cursor="pointer"
                    width="100%"
                    textAlign="left"
                  >
                    <HStack
                      justifyContent="space-between"
                      alignItems="flex-start"
                      width="100%"
                      gap="2"
                    >
                      <Text color="ui.text" lineHeight="1.25">
                        {fv.label || fv.value}
                      </Text>
                      <Text color="ui.textMuted" fontSize="xs" flexShrink={0}>
                        ({fv.count})
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
