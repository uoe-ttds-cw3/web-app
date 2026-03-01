import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { SearchForm } from "@/features/search/components/SearchForm";
import { DateBox } from "@/features/search/components/DateBox";
import type { BackendOptions } from "@/lib/api/types";

export function Header() {
  const router = useRouter();
  const query = (router.query.q as string) || "";
  const panel = (router.query.panel as string) || undefined;
  const backendOptions: BackendOptions = {
    use_expansion: router.query.use_expansion === "true",
    use_pagerank_boost: router.query.use_pagerank_boost === "true",
    use_stemming: router.query.use_stemming !== "false",
    use_hybrid: router.query.use_hybrid !== "false",
  };

  const convertDateFormat = (ddmmyyyy: string): string => {
    const [day, month, year] = ddmmyyyy.split("/");
    return `${year}-${month}-${day}`;
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
        maxW={{ base: "100%", md: "1200px" }}
        mx="auto"
        px={{ base: 3, md: 6, lg: 8 }}
        py={{ base: 3, md: 0 }}
        minH={{ base: "auto", md: "96px" }}
        align={{ base: "center", md: "flex-start" }}
        gap={{ base: 2, md: 4 }}
        direction={{ base: "column", md: "row" }}
      >
        {/* logo - hidden on mobile to save space */}
        <HStack
          flexShrink={0}
          display={{ base: "none", md: "flex" }}
          mt={{ base: 0, md: "18px" }}
        >
          <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
            <Text fontWeight="semibold">FDA Device Search</Text>
          </Link>
        </HStack>

        <Flex
          flex="1"
          maxW="780px"
          w="100%"
          mx="auto"
          align="flex-start"
          gap="12px"
          pt={{ base: 0, md: 2 }}
        >
          <Box flex="1">
            <SearchForm
              onSearch={handleSearch}
              onBackendOptionsChange={handleBackendOptionsChange}
              backendOptions={backendOptions}
              initialQuery={query}
            />
          </Box>
          <Box display={{ base: "none", md: "block" }}>
            <DateBox />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
