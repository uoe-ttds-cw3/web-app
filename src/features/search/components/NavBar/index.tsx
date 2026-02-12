import { Box, Button, Flex, Text, Icon, Skeleton } from "@chakra-ui/react";
import { PiMedalDuotone } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";

type Category = {
  id: string;
  name: string;
};

type NavBarProps = {
  categories?: Category[];
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
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
  return data.panels.map((panel) => ({
    id: panel.code,
    name: panel.name,
  }));
};

export const NavBar = ({
  categories: categoriesProp,
  onCategorySelect,
  selectedCategory,
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

  const categories = categoriesProp || fetchedCategories || [];

  return (
    <Box padding="24px 0">
      <Text fontSize="xl" fontWeight="semibold" marginBottom="0.5rem" color="brand.primary">
        <Icon as={PiMedalDuotone} marginRight="8px" />
        Search by Category
      </Text>

      {/* error state */}
      {error && (
        <Text color="red.500" fontSize="sm">
          Error: {error instanceof Error ? error.message : "Failed to load categories"}
        </Text>
      )}

      <Flex
        overflowX="auto"
        width="100%"
        flexWrap="wrap"
        gap="4px"
      >
        {isFetching ? (
          <>
            {/* skeleton loading with multiple rounded rectangles */}
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                height="40px"
                width="120px"
                borderRadius="8px"
                variant="shine"
                css={{
                  "--start-color": "var(--chakra-colors-brand-greenBg)",
                  "--end-color": "var(--chakra-colors-brand-greenBgLight)",
                }}
              />
            ))}
          </>
        ) : (
          categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => onCategorySelect?.(selectedCategory === category.id ? "" : category.id)}
              backgroundColor={
                selectedCategory === category.id ? "brand.greenBg" : "brand.greenBgLight"
              }
              color="brand.primary"
              padding="12px 24px"
              borderRadius="8px"
              _hover={{
                backgroundColor: selectedCategory === category.id ? "brand.greenBg" : "brand.greenHover",
              }}
            >
              {category.name}
            </Button>
          ))
        )}
      </Flex>

    </Box>
  );
};
