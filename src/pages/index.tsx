import { useRouter } from "next/router";
import { useEffect, useState, useSyncExternalStore } from "react";
import posthog from "posthog-js";
import { ActiveFilterChips } from "@/features/search/components/ActiveFilterChips";
import { DeviceSummaryCard } from "@/features/search/components/DeviceSummaryCard";
import { DidYouMeanSuggestion } from "@/features/search/components/DidYouMeanSuggestion";
import { ExpandedTerms } from "@/features/search/components/ExpandedTerms";
import { PaginationControls } from "@/features/search/components/PaginationControls";
import { ResultsHeader } from "@/features/search/components/ResultsHeader";
import { ResultsControls } from "@/features/search/components/ResultsControls";
import { NavBar } from "@/features/search/components/NavBar";
import { StartSearching } from "@/features/search/components/StartSearching";
import {
  Stack,
  Text,
  Box,
  Spinner,
  Alert,
  Textarea,
} from "@chakra-ui/react";
import { useSearch } from "@/lib/queries/useSearch";
import { transformSearchResult } from "@/lib/api/types";
import type { BackendOptions, Device, ExpansionInfo } from "@/lib/api/types";
import { toaster } from "@/components/ui/Toaster";
import { SideDrawer } from "@/features/search/components/SideDrawer";
import useLocalStorage from "use-local-storage";
import { LANGUAGE_NOT_SUPPORTED } from "@/constants/error-codes";
import { useQuery } from "@tanstack/react-query";

const subscribe = () => () => {};
const SEARCH_CONTENT_MAX_W = "1120px";

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
  const pageSize = Number(router.query.page_size) || 10;
  const offset = (page - 1) * pageSize;
  const sortBy = (router.query.sort_by as string) || undefined;
  const snapshotCutoff = (router.query.snapshot_cutoff as string) || undefined;

  const [filterOpen, setFilterOpen] = useState(false);
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const [selectedDevices, setSelectedDevices] = useLocalStorage<Device[]>(
    "selectedDevices",
    [],
  );

  const selectedDevicesForRender = isHydrated ? selectedDevices : [];

  const handleToggle = (device: Device) => {
    setSelectedDevices((prev = []) => {
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
    limit: pageSize,
    offset,
    include_facets: true,
    use_expansion: useExpansion || undefined,
    use_pagerank_boost: usePagerankBoost || undefined,
    use_stemming: useStemming ? undefined : false,
    use_hybrid: useHybrid ? undefined : false,
    sort_by: sortBy,
    snapshot_cutoff: snapshotCutoff,
  });

  const results = data?.results.map(transformSearchResult) ?? [];
  const totalPages = data ? Math.ceil(data.total_results / pageSize) : 0;
  page = Math.max(Math.min(page, totalPages), 1);

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

    // check for submission number filter - navigate directly to device page
    const submissionTag = tags?.find(
      (tag) => tag.type === "Submission No." && tag.value,
    );
    if (submissionTag) {
      router.push(`/devices/${submissionTag.value.toUpperCase()}`);
      return;
    }

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

    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(
      { pathname: "/", query: { ...router.query, page: String(newPage) } },
      undefined,
      { shallow: true },
    );
  };

  const handlePageSizeChange = (newPageSize: number) => {
    posthog.capture("page_size_changed", {
      from_size: pageSize,
      to_size: newPageSize,
      query: query,
    });

    const { page: _removedPage, ...rest } = router.query;
    router.push(
      { pathname: "/", query: { ...rest, page_size: String(newPageSize) } },
      undefined,
      { shallow: true },
    );
  };

  const handleSortChange = (newSort: string) => {
    posthog.capture("sort_changed", {
      sort_by: newSort || "relevance",
      query: query,
    });

    const { page: _removedPage, ...rest } = router.query;
    if (newSort) {
      router.push(
        { pathname: "/", query: { ...rest, sort_by: newSort } },
        undefined,
        { shallow: true },
      );
    } else {
      const { sort_by: _removedSort, ...finalRest } = rest;
      router.push({ pathname: "/", query: finalRest }, undefined, {
        shallow: true,
      });
    }
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
      {!isLoading && (
        <Box
          margin="0 auto"
          maxW={SEARCH_CONTENT_MAX_W}
          px={{ base: "4", md: "5", lg: "6" }}
        >
          <NavBar
            selectedCategory={panel}
            onCategorySelect={handleCategorySelect}
            searchFacets={
              data?.facets?.find((f) => f.field === "panel_code")?.values
            }
            isResultsLoading={
              isLoading &&
              Boolean(
                query ||
                  panel ||
                  productCode ||
                  dateBefore ||
                  dateAfter ||
                  decision ||
                  deviceClass,
              )
            }
          />
        </Box>
      )}

      {!query && results.length === 0 && (
        <StartSearching onSuggest={handleSearch} selectedCategory={panel} />
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
        <Box
          margin="0 auto"
          maxW={SEARCH_CONTENT_MAX_W}
          px={{ base: "4", md: "5", lg: "6" }}
        >
          <Box minH="100vh" pt="0" pb={{ base: "2", md: "4" }}>
            {/* Header + Controls */}
            <Box marginBottom="4">
              <Box
                display="flex"
                alignItems={{ base: "stretch", md: "center" }}
                justifyContent="space-between"
                marginBottom="3"
                gap="3"
                flexWrap="wrap"
              >
                <ResultsHeader
                  numResults={data.total_results}
                  debugInfo={data.debug_info}
                />
              </Box>

              {/* did you mean suggestion from spelling corrector */}
              {data?.did_you_mean && (
                <DidYouMeanSuggestion
                  suggestion={data.did_you_mean}
                  onSelect={() => {
                    posthog.capture("did_you_mean_clicked", {
                      original_query: query,
                      suggested_query: data.did_you_mean,
                    });
                  }}
                />
              )}

              {data?.expansion_info?.expansion_applied && (
                <ExpandedTerms
                  expansionInfo={data.expansion_info as ExpansionInfo}
                  onTermClick={(term) =>
                    router.push(`/?q=${encodeURIComponent(term)}`)
                  }
                />
              )}

              <ResultsControls
                sortBy={sortBy}
                pageSize={pageSize}
                filterOpen={filterOpen}
                facets={data.facets}
                onSortChange={handleSortChange}
                onPageSizeChange={handlePageSizeChange}
                onFilterToggle={() => setFilterOpen(!filterOpen)}
                onFilterClose={() => setFilterOpen(false)}
                onFacetFilter={handleFacetFilter}
              />
            </Box>

            <ActiveFilterChips
              decision={decision}
              deviceClass={deviceClass}
              panel={panel}
              productCode={productCode}
              onRemove={handleRemoveFacetFilter}
            />

            {data?.error_code === LANGUAGE_NOT_SUPPORTED &&
            data?.error_message ? (
              <Alert.Root status="warning" title={data.error_message}>
                <Alert.Indicator />
                <Alert.Title>{data.error_message}</Alert.Title>
              </Alert.Root>
            ) : (
              <>
                <Stack>
                  {results.map((device) => (
                    <DeviceSummaryCard
                      key={device.id}
                      device={device}
                      selectedDevices={selectedDevicesForRender}
                      onToggle={handleToggle}
                      searchQuery={query}
                    />
                  ))}
                </Stack>

                <PaginationControls
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </Box>
        </Box>
      )}
      <SideDrawer />
    </div>
  );
}
