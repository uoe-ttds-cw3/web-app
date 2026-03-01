import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { PiMedalDuotone } from "react-icons/pi";
import { LuInfo } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Tooltip } from "@/components/ui/Tooltip";

type Category = {
  id: string;
  name: string;
  deviceCount: number;
};

type SearchFacetValue = {
  value: string;
  count: number;
  label: string | null;
};

type NavBarProps = {
  categories?: Category[];
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
  searchFacets?: SearchFacetValue[];
  isResultsLoading?: boolean;
};

type PanelsResponse = {
  panels: { code: string; name: string; device_count: number }[];
  total_panels: number;
};

const fetchPanels = async (): Promise<Category[]> => {
  const response = await fetch("/api/panels");
  if (!response.ok) {
    throw new Error("Failed to fetch panels");
  }
  const data: PanelsResponse = await response.json();
  return data.panels
    .map((panel) => ({
      id: panel.code,
      name: panel.name,
      deviceCount: panel.device_count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const NavBar = ({
  categories: categoriesProp,
  onCategorySelect,
  selectedCategory,
  searchFacets,
  isResultsLoading = false,
}: NavBarProps) => {
  const {
    data: fetchedCategories,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["panels"],
    queryFn: fetchPanels,
    enabled: !categoriesProp,
  });

  const [showAllPills, setShowAllPills] = useState(false);
  const allCategories = categoriesProp || fetchedCategories || [];

  // when search facets are provided, only show panels that appear in the results
  // and use the search-scoped counts instead of total index counts
  const categories = searchFacets
    ? allCategories
        .filter((cat) => searchFacets.some((f) => f.value === cat.id))
        .map((cat) => {
          const facet = searchFacets.find((f) => f.value === cat.id);
          return { ...cat, deviceCount: facet?.count ?? cat.deviceCount };
        })
        .sort((a, b) => b.deviceCount - a.deviceCount)
    : selectedCategory
      ? allCategories.filter((cat) => cat.id === selectedCategory)
      : allCategories;

  // on mobile, show first 4 categories unless expanded
  const mobileLimit = 4;
  const hasMore = categories.length > mobileLimit;
  const showLoadingSkeletons = isFetching || isResultsLoading;
  const tooltipProps = {
    bg: "ui.background",
    color: "ui.text",
    px: 2,
    py: 1,
    borderRadius: "md",
    maxW: "320px",
  };

  return (
    <Box pt="0" pb="12px">
      <HStack
        fontSize={{ base: "md", md: "xl" }}
        fontWeight="semibold"
        marginBottom="0.5rem"
        color="brand.primary"
        gap="2"
      >
        <Icon as={PiMedalDuotone} marginRight="8px" />
        <Text>Filter by Panel (Category)</Text>
        <Tooltip
          content="A panel is an FDA advisory committee for a specific medical specialty or device category. Think of panels as device-grouping departments, such as Cardiovascular or Radiology."
          showArrow
          openDelay={200}
          contentProps={tooltipProps}
        >
          <Box
            color="ui.textMuted"
            cursor="help"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            aria-label="What FDA panels mean"
          >
            <Icon as={LuInfo} boxSize="3.5" />
          </Box>
        </Tooltip>
      </HStack>

      {/* error state */}
      {error && (
        <Text color="red.500" fontSize="sm">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load categories"}
        </Text>
      )}

      {selectedCategory && (!searchFacets || searchFacets.length === 0) && (
        <Button
          size="sm"
          variant="ghost"
          padding="8px 16px"
          marginBottom="8px"
          onClick={() => onCategorySelect?.("")}
        >
          Clear filter
        </Button>
      )}

      <Flex gap="6px" wrap="wrap">
        {showLoadingSkeletons ? (
          <HStack>
            <SkeletonText noOfLines={1} />
          </HStack>
        ) : (
          <>
            {/* mobile: limited pills */}
            <Box display={{ base: "contents", md: "none" }}>
              {(showAllPills
                ? categories
                : categories.slice(0, mobileLimit)
              ).map((category) => (
                <Button
                  key={category.id}
                  onClick={() =>
                    onCategorySelect?.(
                      selectedCategory === category.id ? "" : category.id,
                    )
                  }
                  variant={
                    selectedCategory === category.id ? "solid" : "outline"
                  }
                  backgroundColor={
                    selectedCategory === category.id
                      ? "brand.accentSelected"
                      : "transparent"
                  }
                  color="brand.primary"
                  padding="6px 12px"
                  borderRadius="8px"
                  size="sm"
                  colorPalette="blue"
                  _hover={{
                    backgroundColor:
                      selectedCategory === category.id
                        ? "brand.accentSelected"
                        : "brand.accentBg",
                  }}
                >
                  <Text fontSize="sm">{category.name}</Text>
                  <Text fontSize="11px">({category.deviceCount})</Text>
                </Button>
              ))}
              {hasMore && (
                <Button
                  onClick={() => setShowAllPills(!showAllPills)}
                  variant="ghost"
                  size="sm"
                  color="brand.primary"
                  padding="6px 12px"
                  fontSize="sm"
                >
                  {showAllPills
                    ? "Show less"
                    : `+${categories.length - mobileLimit} more`}
                </Button>
              )}
            </Box>

            {/* desktop: all pills */}
            <Box display={{ base: "none", md: "contents" }}>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() =>
                    onCategorySelect?.(
                      selectedCategory === category.id ? "" : category.id,
                    )
                  }
                  variant={
                    selectedCategory === category.id ? "solid" : "outline"
                  }
                  backgroundColor={
                    selectedCategory === category.id
                      ? "brand.accentSelected"
                      : "transparent"
                  }
                  color="brand.primary"
                  padding="8px 16px"
                  borderRadius="8px"
                  colorPalette="blue"
                  _hover={{
                    backgroundColor:
                      selectedCategory === category.id
                        ? "brand.accentSelected"
                        : "brand.accentBg",
                  }}
                >
                  <Text>{category.name}</Text>
                  <Text fontSize="12px">({category.deviceCount})</Text>
                </Button>
              ))}
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
};
