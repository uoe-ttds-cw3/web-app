import {
  Box,
  Button,
  Collapsible,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa";
import type { FacetField } from "@/lib/api/types";

export type FilterControlProps = {
  filterOpen: boolean;
  facets: FacetField[] | null;
  onFilterToggle: () => void;
  onFilterClose: () => void;
  onFacetFilter: (field: string, value: string) => void;
};

export const FilterControl = ({
  filterOpen,
  facets,
  onFilterToggle,
  onFilterClose,
  onFacetFilter,
}: FilterControlProps) => {
  const hasFacets =
    !!facets && facets.length > 0 && facets.some(({ total }) => total);

  if (!hasFacets) {
    return null;
  }

  return (
    <Box position="relative" marginLeft={{ base: "0", md: "auto" }}>
      <Button
        size="sm"
        variant="ghost"
        colorPalette="blue"
        onClick={onFilterToggle}
        padding="0 0.5rem"
      >
        <Icon as={FaFilter} marginRight="8px" boxSize="3.5" />
        Filter
      </Button>

      {filterOpen && (
        <>
          <Box position="fixed" inset="0" zIndex={9} onClick={onFilterClose} />
          <Box
            position={{ base: "fixed", md: "absolute" }}
            top={{ base: "auto", md: "100%" }}
            bottom={{ base: "0", md: "auto" }}
            left={{ base: "0", md: "auto" }}
            right={{ base: "0", md: "0" }}
            marginTop={{ base: "0", md: "2" }}
            width={{ base: "100%", md: "300px" }}
            maxHeight={{ base: "70vh", md: "400px" }}
            overflowY="auto"
            backgroundColor="ui.surface"
            border="1px solid"
            borderColor="ui.borderLight"
            borderRadius={{ base: "12px 12px 0 0", md: "8px" }}
            boxShadow="lg"
            zIndex={10}
            padding="4"
          >
            {facets?.map((facet) => (
              <Box key={facet.field} marginBottom="4">
                <Collapsible.Root defaultOpen>
                  <Collapsible.Trigger asChild>
                    <Button
                      variant="ghost"
                      width="100%"
                      justifyContent="space-between"
                      fontSize="sm"
                      fontWeight="semibold"
                      color="brand.primary"
                      paddingY="2"
                    >
                      {facet.field === "device_class"
                        ? "Device Class"
                        : facet.field === "panel_code"
                          ? "Panel"
                          : facet.field === "decision_code"
                            ? "Decision"
                            : facet.field}
                    </Button>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <Stack gap="1" marginTop="2">
                      {facet.values.slice(0, 10).map((fv) => (
                        <Box
                          key={fv.value}
                          as="button"
                          onClick={() => onFacetFilter(facet.field, fv.value)}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          padding="2"
                          borderRadius="4px"
                          fontSize="sm"
                          _hover={{
                            backgroundColor: "ui.background",
                          }}
                          cursor="pointer"
                          width="100%"
                          textAlign="left"
                        >
                          <Text color="ui.text">{fv.label || fv.value}</Text>
                          <Text color="ui.textMuted" fontSize="xs">
                            ({fv.count})
                          </Text>
                        </Box>
                      ))}
                    </Stack>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};
