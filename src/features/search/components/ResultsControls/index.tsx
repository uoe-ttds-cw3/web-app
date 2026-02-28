import {
  Box,
  Button,
  Collapsible,
  Icon,
  NativeSelect,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa";
import type { FacetField } from "@/lib/api/types";

export type ResultsControlsProps = {
  sortBy?: string;
  pageSize: number;
  filterOpen: boolean;
  facets: FacetField[] | null;
  onSortChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
  onFilterToggle: () => void;
  onFilterClose: () => void;
  onFacetFilter: (field: string, value: string) => void;
};

export const ResultsControls = ({
  sortBy,
  pageSize,
  filterOpen,
  facets,
  onSortChange,
  onPageSizeChange,
  onFilterToggle,
  onFilterClose,
  onFacetFilter,
}: ResultsControlsProps) => {
  const hasFacets =
    !!facets && facets.length > 0 && facets.some(({ total }) => total);

  return (
    <Box
      display="flex"
      alignItems={{ base: "stretch", md: "center" }}
      justifyContent="space-between"
      gap="3"
      flexWrap="wrap"
      width="100%"
    >
      <Box display="flex" alignItems="center" gap="3" flexWrap="wrap">
        <Box display="flex" alignItems="center" gap="2">
          <Text fontSize="sm" color="ui.textMuted" whiteSpace="nowrap">
            Sort:
          </Text>
          <NativeSelect.Root size="sm" width={{ base: "140px", md: "180px" }}>
            <NativeSelect.Field
              value={sortBy || ""}
              onChange={(e) => onSortChange(e.currentTarget.value)}
            >
              <option value="">Relevance</option>
              <option value="decision_date_desc">Newest Approved</option>
              <option value="decision_date_asc">Oldest Approved</option>
              <option value="date_received_desc">Newest Submitted</option>
              <option value="date_received_asc">Oldest Submitted</option>
              <option value="manufacturer_asc">Manufacturer A-Z</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <Box display="flex" alignItems="center" gap="2">
          <Text fontSize="sm" color="ui.textMuted" whiteSpace="nowrap">
            Show:
          </Text>
          <NativeSelect.Root size="sm" width="80px">
            <NativeSelect.Field
              value={String(pageSize)}
              onChange={(e) => onPageSizeChange(Number(e.currentTarget.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>
      </Box>

      {hasFacets && (
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
              <Box
                position="fixed"
                inset="0"
                zIndex={9}
                onClick={onFilterClose}
              />
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
                              onClick={() =>
                                onFacetFilter(facet.field, fv.value)
                              }
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
                              <Text color="ui.text">
                                {fv.label || fv.value}
                              </Text>
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
      )}
    </Box>
  );
};
