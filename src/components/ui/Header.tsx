import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { SearchForm } from "@/features/search/components/SearchForm";
import { DateBox } from "@/features/search/components/DateBox";
import type { BackendOptions } from "@/lib/api/types";

export function Header() {
  const router = useRouter();
  const query = (router.query.q as string) || '';
  const panel = (router.query.panel as string) || undefined;
  const productCode = (router.query.product_code as string) || undefined;
  const dateBefore = (router.query.date_to as string) || undefined;
  const dateAfter = (router.query.date_from as string) || undefined;
  const snapshotCutoff = (router.query.snapshot_cutoff as string) || undefined;

  const convertDateFormat = (ddmmyyyy: string): string => {
    const [day, month, year] = ddmmyyyy.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleSearch = (newQuery: string, tags?: Array<{ id: string; type: string; value: string }>, backendOptions?: BackendOptions) => {
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
      tags.forEach(tag => {
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
    if (backendOptions) {
      if (backendOptions.use_expansion) queryParams.use_expansion = 'true';
      if (backendOptions.use_pagerank_boost) queryParams.use_pagerank_boost = 'true';
      if (!backendOptions.use_stemming) queryParams.use_stemming = 'false';
      if (!backendOptions.use_hybrid) queryParams.use_hybrid = 'false';
    }

    // preserve panel filter if exists
    if (panel) {
      queryParams.panel = panel;
    }

    router.push({
      pathname: '/',
      query: queryParams
    }, undefined, { shallow: true });
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
        align="center"
        gap={{ base: 2, md: 4 }}
        direction={{ base: "column", md: "row" }}
      >
        {/* logo - hidden on mobile to save space */}
        <HStack flexShrink={0} display={{ base: "none", md: "flex" }}>
          <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
            <Text fontWeight="semibold">searchFDA</Text>
          </Link>
        </HStack>

        <Flex flex="1" maxW="780px" w="100%" mx="auto" align="center" gap="12px">
          <Box flex="1">
            <SearchForm onSearch={handleSearch} initialQuery={query} />
          </Box>
          <Box display={{ base: "none", md: "block" }}>
            <DateBox />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
