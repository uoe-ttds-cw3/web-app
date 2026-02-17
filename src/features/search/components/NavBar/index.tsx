import {
  Box,
  Button,
  Flex,
  Text,
  Icon,
  Skeleton,
  HStack,
  SkeletonText,
  Grid,
  Badge,
} from "@chakra-ui/react";
import { PiMedalDuotone } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";

type Category = {
  id: string;
  name: string;
  deviceCount: number;
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
      <Text
        fontSize="xl"
        fontWeight="semibold"
        marginBottom="0.5rem"
        color="#266429"
      >
        <Icon as={PiMedalDuotone} marginRight="8px" />
        Search by Category
      </Text>

      {/* error state */}
      {error && (
        <Text color="red.500" fontSize="sm">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load categories"}
        </Text>
      )}

      <Flex gap="4px" wrap="wrap">
        {isFetching ? (
          <>
            <HStack>
              <SkeletonText noOfLines={1} />
            </HStack>
          </>
        ) : (
          categories.map((category, index) => (
            <Button
              key={category.id}
              onClick={() =>
                onCategorySelect?.(
                  selectedCategory === category.id ? "" : category.id,
                )
              }
              backgroundColor={
                selectedCategory === category.id ? "#4CAF5052" : "#4CAF5029"
              }
              color="brand.primary"
              padding="12px 24px"
              borderRadius={
                index === 0
                  ? "8px 0 0 8px"
                  : index === categories.length - 1
                    ? "0 8px 8px 0"
                    : "0"
              }
              _hover={{
                backgroundColor:
                  selectedCategory === category.id ? "#4CAF5052" : "#4caf4f7e",
              }}
            >
              <Text>{category.name}</Text>
              <Text fontSize="12px">({category.deviceCount})</Text>
            </Button>
          ))
        )}
      </Flex>
    </Box>
  );
};
