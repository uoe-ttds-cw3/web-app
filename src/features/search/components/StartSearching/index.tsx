import { Center, Icon, VStack, Text, Box } from "@chakra-ui/react";
import { PiStethoscopeDuotone } from "react-icons/pi";
import posthog from "posthog-js";
import { pickRandomSuggestions } from "./suggestions";

type StartSearchingProps = {
  onSuggest?: (suggestion: string) => void;
  suggestions?: string[];
};

export const StartSearching = ({
  onSuggest,
  suggestions = [],
}: StartSearchingProps) => {
  return (
    <Center padding="1rem">
      <VStack gap="4px">
        <Icon as={PiStethoscopeDuotone} fontSize="120px" color="gray.300" />
        <Text fontSize="lg" fontWeight="bold" color="brand.primary" mb="2">
          Start Searching!
        </Text>
        <Text fontSize="md" color="ui.textMuted" mb="3">
          Try searching for:
        </Text>
        <Box display="flex" gap="8px" justifyContent="center" flexWrap="wrap">
          {suggestions.map((suggestion) => (
            <Box
              key={suggestion}
              as="button"
              onClick={() => {
                // track suggestion click
                posthog.capture("search_suggestion_clicked", { suggestion });
                onSuggest?.(suggestion);
              }}
              marginTop="10px"
              padding="6px 16px"
              borderRadius="20px"
              backgroundColor="brand.accentBg"
              color="brand.primary"
              fontSize="sm"
              cursor="pointer"
              _hover={{ backgroundColor: "brand.accentHover" }}
            >
              {suggestion}
            </Box>
          ))}
        </Box>
      </VStack>
    </Center>
  );
};
