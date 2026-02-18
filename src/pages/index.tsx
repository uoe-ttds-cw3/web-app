import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import {
  DeviceSummaryCard,
  Device,
} from "@/features/search/components/DeviceSummaryCard";
import { ResultsHeader } from "@/features/search/components/ResultsHeader";
import { NavBar } from "@/features/search/components/NavBar";
import { StartSearching } from "@/features/search/components/StartSearching";
import {
  Stack,
  Text,
  Box,
  Spinner,
  Button,
  Collapsible,
} from "@chakra-ui/react";
import { useSearch } from "@/lib/queries/useSearch";
import { transformSearchResult } from "@/lib/api/types";
import type { BackendOptions } from "@/lib/api/types";
import { toaster } from "@/components/ui/Toaster";
import { SideDrawer } from "@/features/search/components/SideDrawer";
import { FaFilter, FaTimes } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const query = (router.query.q as string) || "";
  const panel = (router.query.panel as string) || undefined;
  const productCode = (router.query.product_code as string) || undefined;
  const dateBefore = (router.query.date_to as string) || undefined;
  const dateAfter = (router.query.date_from as string) || undefined;
  const decision = (router.query.decision as string) || undefined;
  const deviceClass = (router.query.device_class as string) || undefined;

  // backend search options from url
  const useExpansion = router.query.use_expansion === "true";
  const usePagerankBoost = router.query.use_pagerank_boost === "true";
  const useStemming = router.query.use_stemming !== "false"; // default true
  const useHybrid = router.query.use_hybrid !== "false"; // default true

  let page = Number(router.query.page) || 1;
  const limit = 1;
  const offset = (page - 1) * limit;

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedDevices");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved devices:", e);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("selectedDevices", JSON.stringify(selectedDevices));
  }, [selectedDevices]);

  const handleToggle = (device: Device) => {
    setSelectedDevices((prev) => {
      const exists = prev.some((d) => d.id === device.id);
      // track device comparison toggle
      if (exists) {
        posthog.capture("device_removed_from_comparison", {
          device_id: device.id,
          device_name: device.name,
          product_code: device.pCode,
        });
      } else {
        posthog.capture("device_added_to_comparison", {
          device_id: device.id,
          device_name: device.name,
          product_code: device.pCode,
          comparison_count: prev.length + 1,
        });
      }
      return exists
        ? prev.filter((d) => d.id !== device.id)
        : [...prev, device];
    });
  };

  const { data, isLoading, error } = useSearch(query, {
    panel,
    product_code: productCode,
    date_from: dateAfter,
    date_to: dateBefore,
    decision,
    device_class: deviceClass,
    limit,
    offset,
    include_facets: true,
    use_expansion: useExpansion || undefined,
    use_pagerank_boost: usePagerankBoost || undefined,
    use_stemming: useStemming ? undefined : false,
    use_hybrid: useHybrid ? undefined : false,
  });
  const results = data?.results.map(transformSearchResult) ?? [];
  const resultsPerPage = 10;
  const totalPages = data ? Math.ceil(data.total_results / resultsPerPage) : 0;
  page = Math.max(Math.min(page, totalPages), 1)

  useEffect(() => {
    if (error) {
      toaster.create({
        title: "Search failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch search results",
        type: "error",
        duration: Infinity,
      });
    }
  }, [error]);

  const convertDateFormat = (ddmmyyyy: string): string => {
    const [day, month, year] = ddmmyyyy.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleSearch = (
    newQuery: string,
    tags?: Array<{ id: string; type: string; value: string }>,
    backendOptions?: BackendOptions,
  ) => {
    // track search performed
    posthog.capture("search_performed", {
      query: newQuery,
      has_filters: !!tags && tags.length > 0,
      filter_count: tags?.length ?? 0,
      panel_filter: panel,
      use_expansion: backendOptions?.use_expansion ?? false,
      use_pagerank_boost: backendOptions?.use_pagerank_boost ?? false,
      use_stemming: backendOptions?.use_stemming ?? true,
      use_hybrid: backendOptions?.use_hybrid ?? true,
    });

    const queryParams: Record<string, string> = { q: newQuery };

    if (tags) {
      tags.forEach((tag) => {
        if (tag.value) {
          if (tag.type === "Product Code") {
            queryParams.product_code = tag.value;
          } else if (tag.type === "Before") {
            queryParams.date_to = convertDateFormat(tag.value);
          } else if (tag.type === "After") {
            queryParams.date_from = convertDateFormat(tag.value);
          }
        }
      });
    }

    // serialize backend options - only non-default values
    if (backendOptions) {
      if (backendOptions.use_expansion) queryParams.use_expansion = "true";
      if (backendOptions.use_pagerank_boost)
        queryParams.use_pagerank_boost = "true";
      if (!backendOptions.use_stemming) queryParams.use_stemming = "false";
      if (!backendOptions.use_hybrid) queryParams.use_hybrid = "false";
    }

    if (panel) {
      queryParams.panel = panel;
    }

    // reset to page 1 on new search
    router.push(
      {
        pathname: "/",
        query: queryParams,
      },
      undefined,
      { shallow: true },
    );
  };

  const handleCategorySelect = (panelCode?: string) => {
    // track category selection
    posthog.capture("category_selected", {
      panel_code: panelCode || null,
      action: panelCode ? "selected" : "deselected",
      current_query: query,
    });

    if (panelCode) {
      const { page: _removedPage, ...rest } = router.query;
      router.push(
        { pathname: "/", query: { ...rest, panel: panelCode } },
        undefined,
        { shallow: true },
      );
    } else {
      const {
        panel: _removedPanel,
        page: _removedPage,
        ...rest
      } = router.query;
      router.push({ pathname: "/", query: rest }, undefined, { shallow: true });
    }
  };

  const handlePageChange = (newPage: number) => {
    // track pagination
    posthog.capture("pagination_changed", {
      from_page: page,
      to_page: newPage,
      total_pages: totalPages,
      query: query,
    });

    router.push(
      { pathname: "/", query: { ...router.query, page: String(newPage) } },
      undefined,
      { shallow: true },
    );
  };

  const handleFacetFilter = (field: string, value: string) => {
    // track filter applied
    posthog.capture("filter_applied", {
      filter_type: field,
      filter_value: value,
      current_query: query,
    });

    const fieldMap: Record<string, string> = {
      panel_code: "panel",
      decision_code: "decision",
    };
    const paramName = fieldMap[field] || field;
    const { page: _removedPage, ...rest } = router.query;
    router.push(
      { pathname: "/", query: { ...rest, [paramName]: value } },
      undefined,
      { shallow: true },
    );
    setFilterOpen(false);
  };

  const handleRemoveFacetFilter = (field: string) => {
    // track filter removed
    posthog.capture("filter_removed", {
      filter_type: field,
      current_query: query,
    });

    const fieldMap: Record<string, string> = {
      panel_code: "panel",
      decision_code: "decision",
    };
    const paramName = fieldMap[field] || field;
    const { [paramName]: _removed, page: _removedPage, ...rest } = router.query;
    router.push({ pathname: "/", query: rest }, undefined, { shallow: true });
  };

  return (
    <div>
      <Box pr="40px" margin="0 auto" maxW="900px">
        <NavBar
          selectedCategory={panel}
          onCategorySelect={handleCategorySelect}
        />
      </Box>
      {!query && results.length === 0 && (
        <StartSearching onSuggest={handleSearch} />
      )}

      {isLoading && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="40px"
        >
          <Spinner size="lg" color="brand.primary" />
          <Text color="brand.primary" marginTop="16px" fontSize="lg">
            Searching...
          </Text>
        </Box>
      )}

      {data && (
        <Box margin="0 auto" maxW="1000px" px="4">
          <Box minH="100vh" p="4">
            {/* Header + Filter button */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              marginBottom="4"
            >
              <ResultsHeader numResults={data.total_results} />

              {data.facets &&
                data.facets.length > 0 &&
                data.facets.some(({ total }) => total) && (
                  <Box position="relative">
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="green"
                      onClick={() => setFilterOpen(!filterOpen)}
                    >
                      <FaFilter style={{ marginRight: "8px" }} />
                      Filter
                    </Button>

                    {filterOpen && (
                      <>
                        <Box
                          position="fixed"
                          inset="0"
                          zIndex={9}
                          onClick={() => setFilterOpen(false)}
                        />
                        <Box
                          position="absolute"
                          top="100%"
                          right="0"
                          marginTop="2"
                          width="300px"
                          maxHeight="400px"
                          overflowY="auto"
                          backgroundColor="ui.surface"
                          border="1px solid"
                          borderColor="ui.borderLight"
                          borderRadius="8px"
                          boxShadow="lg"
                          zIndex={10}
                          padding="4"
                        >
                          {data.facets.map((facet) => (
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
                                          handleFacetFilter(
                                            facet.field,
                                            fv.value,
                                          )
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
                                        <Text
                                          color="ui.textMuted"
                                          fontSize="xs"
                                        >
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

            {/* Active filter chips */}
            {(decision || deviceClass || panel || productCode) && (
              <Box display="flex" gap="2" marginBottom="4" flexWrap="wrap">
                {decision && (
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    gap="2"
                    padding="6px 12px"
                    backgroundColor="brand.greenBg"
                    color="brand.primary"
                    borderRadius="16px"
                    fontSize="sm"
                  >
                    <Text>Decision: {decision}</Text>
                    <Box
                      as="button"
                      onClick={() => handleRemoveFacetFilter("decision")}
                      cursor="pointer"
                      display="flex"
                      alignItems="center"
                    >
                      <FaTimes size={12} />
                    </Box>
                  </Box>
                )}
                {deviceClass && (
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    gap="2"
                    padding="6px 12px"
                    backgroundColor="brand.greenBg"
                    color="brand.primary"
                    borderRadius="16px"
                    fontSize="sm"
                  >
                    <Text>Class: {deviceClass}</Text>
                    <Box
                      as="button"
                      onClick={() => handleRemoveFacetFilter("device_class")}
                      cursor="pointer"
                      display="flex"
                      alignItems="center"
                    >
                      <FaTimes size={12} />
                    </Box>
                  </Box>
                )}
                {panel && (
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    gap="2"
                    padding="6px 12px"
                    backgroundColor="brand.greenBg"
                    color="brand.primary"
                    borderRadius="16px"
                    fontSize="sm"
                  >
                    <Text>Panel: {panel}</Text>
                    <Box
                      as="button"
                      onClick={() => handleRemoveFacetFilter("panel")}
                      cursor="pointer"
                      display="flex"
                      alignItems="center"
                    >
                      <FaTimes size={12} />
                    </Box>
                  </Box>
                )}
                {productCode && (
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    gap="2"
                    padding="6px 12px"
                    backgroundColor="brand.greenBg"
                    color="brand.primary"
                    borderRadius="16px"
                    fontSize="sm"
                  >
                    <Text>Product: {productCode}</Text>
                    <Box
                      as="button"
                      onClick={() => handleRemoveFacetFilter("product_code")}
                      cursor="pointer"
                      display="flex"
                      alignItems="center"
                    >
                      <FaTimes size={12} />
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            <Stack>
              {results.slice((page-1)*resultsPerPage, page*resultsPerPage).map((device) => (
                <DeviceSummaryCard
                  key={device.id}
                  device={device}
                  selectedDevices={selectedDevices}
                  onToggle={handleToggle}
                  searchQuery={query}
                />
              ))}
            </Stack>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="2"
                paddingY="6"
                marginTop="6"
              >
                <Button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  size="sm"
                  variant="outline"
                  colorScheme="green"
                >
                  Previous
                </Button>
                <Box display="flex" gap="1" alignItems="center">
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    const pageNum = i + 1;
                    const showPage =
                      pageNum <= 3 ||
                      pageNum >= totalPages - 2 ||
                      Math.abs(pageNum - page) <= 2;
                    if (!showPage) {
                      if (
                        (pageNum === 4 && page > 6) ||
                        (pageNum === totalPages - 3 && page < totalPages - 5)
                      ) {
                        return (
                          <Text key={pageNum} color="ui.textMuted" px="1">
                            ...
                          </Text>
                        );
                      }
                      return null;
                    }
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        size="sm"
                        variant={pageNum === page ? "solid" : "ghost"}
                        colorScheme="green"
                        bg={pageNum === page ? "brand.primary" : undefined}
                        color={pageNum === page ? "white" : "brand.primary"}
                        minW="8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </Box>
                <Button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  size="sm"
                  variant="outline"
                  colorScheme="green"
                >
                  Next
                </Button>
                <Text color="ui.textMuted" fontSize="sm" ml="4">
                  Page {page} of {totalPages}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      )}

      <SideDrawer selectedDeviceIds={selectedDevices.map((d) => d.id)} />
    </div>
  );
}
