import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DeviceSummaryCard } from "@/features/search/components/DeviceSummaryCard";
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
import { transformSearchResult, FacetField } from "@/lib/api/types";
import { toaster } from "@/components/ui/Toaster";
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

  // pagination state from url
  const page = Number(router.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  // filter dropdown state
  const [filterOpen, setFilterOpen] = useState(false);

  const { data, isFetching, isLoading, error } = useSearch(query, {
    panel,
    product_code: productCode,
    date_from: dateAfter,
    date_to: dateBefore,
    decision,
    device_class: deviceClass,
    limit,
    offset,
    include_facets: true,
  });
  const results = data?.results.map(transformSearchResult) ?? [];
  const totalPages = data ? Math.ceil(data.total_results / limit) : 0;

  // show error toast when search fails
  useEffect(() => {
    if (error) {
      toaster.create({
        title: "Search failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch search results",
        type: "error",
        duration: Infinity, // persist until dismissed
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
  ) => {
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
    // reset to page 1 on category change
    if (panelCode) {
      const { page: _removedPage, ...rest } = router.query;
      router.push(
        {
          pathname: "/",
          query: { ...rest, panel: panelCode },
        },
        undefined,
        { shallow: true },
      );
    } else {
      const {
        panel: _removedPanel,
        page: _removedPage,
        ...rest
      } = router.query;
      router.push(
        {
          pathname: "/",
          query: rest,
        },
        undefined,
        { shallow: true },
      );
    }
  };

  const handlePageChange = (newPage: number) => {
    router.push(
      {
        pathname: "/",
        query: { ...router.query, page: String(newPage) },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleFacetFilter = (field: string, value: string) => {
    // reset to page 1 on filter change
    const { page: _removedPage, ...rest } = router.query;
    router.push(
      {
        pathname: "/",
        query: { ...rest, [field]: value },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleRemoveFacetFilter = (field: string) => {
    const { [field]: _removed, page: _removedPage, ...rest } = router.query;
    router.push(
      {
        pathname: "/",
        query: rest,
      },
      undefined,
      { shallow: true },
    );
  };

  // navbar below header
  return (
    <div>
      <NavBar
        selectedCategory={panel}
        onCategorySelect={handleCategorySelect}
      />

      {/* show start searching when no query */}
      {!query && results.length === 0 && (
        <StartSearching onSuggest={handleSearch} />
      )}

      {/* first load - centered spinner */}
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

      {/* results with loading overlay */}
      {data && (
        <Box position="relative">
          {/* loading overlay on top of stale results */}
          {isFetching && (
            <Box
              position="absolute"
              inset="0"
              bg="whiteAlpha.700"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex="5"
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Spinner size="lg" color="brand.primary" />
                <Text color="brand.primary" marginTop="16px" fontSize="lg">
                  Searching...
                </Text>
              </Box>
            </Box>
          )}

          {/* empty results state */}
          {data.results.length === 0 ? (
            <Box textAlign="center" padding="40px" color="ui.textMuted">
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="brand.primary"
                mb="2"
              >
                No results found for &quot;{query}&quot;
              </Text>
              <Text mb="4">Try a different search term:</Text>
              <Box
                display="flex"
                gap="8px"
                justifyContent="center"
                flexWrap="wrap"
              >
                {[
                  "insulin pump",
                  "pacemaker",
                  "catheter",
                  "hip implant",
                  "blood pressure",
                ].map((suggestion) => (
                  <Box
                    key={suggestion}
                    as="button"
                    onClick={() => handleSearch(suggestion)}
                    padding="6px 16px"
                    borderRadius="20px"
                    backgroundColor="brand.greenBg"
                    color="brand.primary"
                    fontSize="sm"
                    cursor="pointer"
                    _hover={{ backgroundColor: "brand.greenHover" }}
                  >
                    {suggestion}
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom="4"
              >
                <ResultsHeader numResults={data.total_results} />

                {/* filter button with dropdown */}
                {data.facets && data.facets.length > 0 && (
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

                    {/* filter dropdown */}
                    {filterOpen && (
                      <>
                        {/* backdrop to close dropdown */}
                        <Box
                          position="fixed"
                          inset="0"
                          zIndex={9}
                          onClick={() => setFilterOpen(false)}
                        />

                        {/* dropdown content */}
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
                              <Collapsible.Root defaultOpen={true}>
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
                                    {facet.values
                                      .slice(0, 10)
                                      .map((facetValue) => (
                                        <Box
                                          key={facetValue.value}
                                          as="button"
                                          onClick={() => {
                                            handleFacetFilter(
                                              facet.field,
                                              facetValue.value,
                                            );
                                            setFilterOpen(false);
                                          }}
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
                                            {facetValue.label ||
                                              facetValue.value}
                                          </Text>
                                          <Text
                                            color="ui.textMuted"
                                            fontSize="xs"
                                          >
                                            ({facetValue.count})
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

              {/* active filter chips */}
              {(decision || deviceClass) && (
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
                </Box>
              )}

              <Stack>
                {results.map((device) => (
                  <DeviceSummaryCard
                    key={device.id}
                    device={device}
                    searchQuery={query}
                  />
                ))}
              </Stack>

              {/* pagination controls */}
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

                  {/* page numbers */}
                  <Box display="flex" gap="1" alignItems="center">
                    {Array.from(
                      { length: Math.min(totalPages, 10) },
                      (_, i) => {
                        // show first 3, current -2 to +2, last 3
                        const pageNum = i + 1;
                        const showPage =
                          pageNum <= 3 ||
                          pageNum >= totalPages - 2 ||
                          Math.abs(pageNum - page) <= 2;

                        if (!showPage) {
                          // show ellipsis for skipped pages
                          if (
                            (pageNum === 4 && page > 6) ||
                            (pageNum === totalPages - 3 &&
                              page < totalPages - 5)
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
                      },
                    )}
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

                  {/* page info text */}
                  <Text color="ui.textMuted" fontSize="sm" ml="4">
                    Page {page} of {totalPages}
                  </Text>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </div>
  );
}
