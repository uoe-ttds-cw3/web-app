import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { SearchForm } from "@/features/search/components/SearchForm";
import type { BackendOptions } from "@/lib/api/types";

export function Header() {
  const router = useRouter();
  const query = (router.query.q as string) || '';
  const panel = (router.query.panel as string) || undefined;
  const productCode = (router.query.product_code as string) || undefined;
  const dateBefore = (router.query.date_to as string) || undefined;
  const dateAfter = (router.query.date_from as string) || undefined;

  const convertDateFormat = (ddmmyyyy: string): string => {
    const [day, month, year] = ddmmyyyy.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleSearch = (newQuery: string, tags?: Array<{ id: string; type: string; value: string }>, backendOptions?: BackendOptions) => {
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
        px={{ base: 4, md: 6, lg: 8 }}
        h="96px"
        align="center"
        gap="4"
      >
        {/* logo left */}
        <HStack flexShrink={0}>
          <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
            <Text fontWeight="semibold">searchFDA</Text>
          </Link>
        </HStack>

        {/* search bar center - flexible with max width */}
        <Box flex="1" maxW="600px" mx="auto">
          <SearchForm onSearch={handleSearch} initialQuery={query} />
        </Box>

        {/* empty space right for balance */}
        <Box w="120px" flexShrink={0} />
      </Flex>
    </Box>
  );
}
