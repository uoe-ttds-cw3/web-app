import { Box, Button, Flex, Text, Icon } from "@chakra-ui/react";
import { PiMedalDuotone } from "react-icons/pi";

type Category = {
  id: string;
  name: string;
};

type NavBarProps = {
  categories?: Category[];
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
};

export const NavBar = ({
  categories = [
    { id: "DE", name: "Dental" },
    { id: "CV", name: "Cardiovascular" },
    { id: "AN", name: "Anesthesiology" },
  ],
  onCategorySelect,
  selectedCategory,
}: NavBarProps) => {
  return (
    <Box padding="24px 0">
      <Text fontSize="xl" fontWeight="semibold" marginBottom="0.5rem" color="#266429">
        <Icon as={PiMedalDuotone} marginRight="8px" />
        Search by Category
      </Text>
      <Flex
        overflowX="auto"
        paddingBottom="8px"
      >
        {categories.map((category, index) => (
          <Button
            key={category.id}
            onClick={() => onCategorySelect?.(category.id)}
            backgroundColor={
              selectedCategory === category.id ? "#4CAF5052" : "#4CAF5029"
            }
            color="#266429"
            padding="12px 24px"
            borderRadius={
              index === 0
                ? "8px 0 0 8px"
                : index === categories.length - 1
                  ? "0 8px 8px 0"
                  : "0"
            }
          >
            {category.name}
          </Button>
        ))}
      </Flex>

      {/* {selectedCategory && (
        <Text fontSize="sm" marginTop="12px" color="#266429">
          Selected: {categories.find(c => c.id === selectedCategory)?.name}
        </Text>
      )} */}

    </Box>
  );
};
