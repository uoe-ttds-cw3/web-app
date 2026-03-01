import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Box, Button, Flex, Icon, Link, Text } from "@chakra-ui/react";
import { FaSlidersH } from "react-icons/fa";
import {
  HEADER_SEARCH_FORM_ID,
  SearchForm,
} from "@/features/search/components/SearchForm";
import type { BackendOptions } from "@/lib/api/types";

const HEADER_CONTROL_HEIGHT = "48px";
const HEADER_CONTENT_MAX_W = "1000px";

export function Header() {
  const router = useRouter();
  const [advancedPanelOpen, setAdvancedPanelOpen] = useState(false);
  const query = (router.query.q as string) || "";
  const panel = (router.query.panel as string) || undefined;
  const backendOptions: BackendOptions = {
    use_expansion: router.query.use_expansion === "true",
    use_pagerank_boost: router.query.use_pagerank_boost === "true",
    use_stemming: router.query.use_stemming !== "false",
    use_hybrid: router.query.use_hybrid !== "false",
  };

  const convertDateFormat = (ddmmyyyy: string): string => {
    if (ddmmyyyy.includes("-")) {
      return ddmmyyyy;
    }
    const [day, month, year] = ddmmyyyy.split("/");
    return `${year}-${month}-${day}`;
  };

  const activeQuickFilters = [
    {
      key: "date_from",
      label: "After",
      value: typeof router.query.date_from === "string"
        ? router.query.date_from
        : "",
    },
    {
      key: "date_to",
      label: "Before",
      value: typeof router.query.date_to === "string"
        ? router.query.date_to
        : "",
    },
  ].filter((filter) => filter.value);

  const clearQuickFilter = (key: string) => {
    const { [key]: _removed, ...rest } = router.query;
    router.push({ pathname: "/", query: rest }, undefined, { shallow: true });
  };

  const applyBackendOptionsToQuery = (
    queryParams: Record<string, string>,
    backendOptions?: BackendOptions,
  ) => {
    if (!backendOptions) {
      return;
    }

    if (backendOptions.use_expansion) queryParams.use_expansion = "true";
    if (backendOptions.use_pagerank_boost)
      queryParams.use_pagerank_boost = "true";
    if (!backendOptions.use_stemming) queryParams.use_stemming = "false";
    if (!backendOptions.use_hybrid) queryParams.use_hybrid = "false";
  };

  const handleSearch = (
    newQuery: string,
    tags?: Array<{ id: string; type: string; value: string }>,
    backendOptions?: BackendOptions,
  ) => {
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

    // serialize backend options - only send non-default values
    applyBackendOptionsToQuery(queryParams, backendOptions);

    // preserve panel filter if exists
    if (panel) {
      queryParams.panel = panel;
    }

    router.push(
      {
        pathname: "/",
        query: queryParams,
      },
      undefined,
      { shallow: true },
    );
  };

  const handleBackendOptionsChange = (backendOptions: BackendOptions) => {
    if (router.pathname !== "/") {
      return;
    }

    const nextQuery: Record<string, string> = {};

    Object.entries(router.query).forEach(([key, value]) => {
      if (
        key === "use_expansion" ||
        key === "use_pagerank_boost" ||
        key === "use_stemming" ||
        key === "use_hybrid"
      ) {
        return;
      }

      if (typeof value === "string") {
        nextQuery[key] = value;
      }
    });

    applyBackendOptionsToQuery(nextQuery, backendOptions);

    router.push(
      {
        pathname: "/",
        query: nextQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="10"
      bg="ui.background"
      borderBottom="1px solid"
      borderColor="ui.border"
    >
      <Flex
        maxW={HEADER_CONTENT_MAX_W}
        mx="auto"
        px={{ base: 3, md: 6, lg: 8 }}
        py={{ base: 3, md: 3 }}
        minH={{ base: "auto", md: "136px" }}
        align="center"
        gap={{ base: 2, md: 4 }}
        direction={{ base: "column", md: "row" }}
      >
        <Box flex="1" maxW="100%" w="100%" mx="auto">
          <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
            <Text fontWeight="semibold" marginBottom="8px">
              FDA Device Search
            </Text>
          </Link>

          <Flex
            align={{ base: "stretch", md: "center" }}
            gap="12px"
            direction={{ base: "column", md: "row" }}
          >
            <Box flex="1">
              <SearchForm
                onSearch={handleSearch}
                onBackendOptionsChange={handleBackendOptionsChange}
                backendOptions={backendOptions}
                initialQuery={query}
                advancedPanelOpen={advancedPanelOpen}
                onAdvancedPanelOpenChange={setAdvancedPanelOpen}
              />
            </Box>
            <Flex
              alignSelf={{ base: "flex-end", md: "auto" }}
              gap="8px"
              flexShrink={0}
            >
              <Button
                type="button"
                display="inline-flex"
                alignItems="center"
                gap="8px"
                minH={HEADER_CONTROL_HEIGHT}
                px="14px"
                borderRadius="8px"
                border="1px solid"
                borderColor="ui.borderLight"
                bg="ui.background"
                color="brand.primary"
                fontSize="sm"
                fontWeight="500"
                _hover={{ bg: "ui.surface" }}
                _active={{ bg: "ui.surface" }}
                onClick={() => setAdvancedPanelOpen((prev) => !prev)}
              >
                <Icon as={FaSlidersH} boxSize="4" />
                Advanced
              </Button>
              <Button
                type="submit"
                form={HEADER_SEARCH_FORM_ID}
                minH={HEADER_CONTROL_HEIGHT}
                px="18px"
                borderRadius="8px"
                bg="brand.primary"
                color="white"
                fontSize="sm"
                fontWeight="600"
                _hover={{ bg: "brand.primary" }}
                _active={{ bg: "brand.primary" }}
              >
                Search
              </Button>
            </Flex>
          </Flex>

          <Box minH={{ base: activeQuickFilters.length ? "auto" : "0", md: "40px" }} mt="8px">
            {activeQuickFilters.length > 0 && (
              <Box display="flex" gap="8px" flexWrap="wrap">
                {activeQuickFilters.map((filter) => (
                  <Box
                    key={filter.key}
                    display="inline-flex"
                    alignItems="center"
                    gap="6px"
                    padding="4px 10px"
                    borderRadius="10px"
                    backgroundColor="brand.accentBg"
                    color="brand.primary"
                    fontSize="sm"
                    lineHeight="1"
                  >
                    <Text fontSize="sm">
                      {filter.label}: {filter.value}
                    </Text>
                    <Box
                      as="button"
                      onClick={() => clearQuickFilter(filter.key)}
                      cursor="pointer"
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      lineHeight="1"
                    >
                      x
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
