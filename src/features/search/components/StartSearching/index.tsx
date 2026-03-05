import {
  Center,
  Icon,
  VStack,
  Text,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { PiStethoscopeDuotone } from "react-icons/pi";
import posthog from "posthog-js";
import NextLink from "next/link";

type StartSearchingProps = {
  onSuggest?: (suggestion: string) => void;
  suggestions?: string[];
  compact?: boolean;
};

export const StartSearching = ({
  onSuggest,
  suggestions = [],
  compact = false,
}: StartSearchingProps) => {
  return (
    <Center padding="1rem">
      <VStack gap="4px">
        {!compact && (
          <Icon as={PiStethoscopeDuotone} fontSize="120px" color="gray.300" />
        )}
        {!compact && (
          <Text fontSize="lg" fontWeight="bold" color="brand.primary" mb="2">
            Start Searching!
          </Text>
        )}
        <Text fontSize="md" color="ui.textMuted" mb="3">
          Try searching for:
        </Text>
        <Box display="flex" gap="8px" justifyContent="center" flexWrap="wrap">
          {suggestions.map((suggestion) => (
            <ChakraLink
              key={suggestion}
              as={NextLink}
              href={`/?q=${encodeURIComponent(suggestion)}`}
              onClick={(event) => {
                // track suggestion click
                posthog.capture("search_suggestion_clicked", { suggestion });

                if (onSuggest) {
                  event.preventDefault();
                  onSuggest(suggestion);
                }
              }}
              marginTop="10px"
              padding="6px 16px"
              borderRadius="20px"
              backgroundColor="brand.accentBg"
              color="brand.primary"
              fontSize="sm"
              textDecoration="none"
              cursor="pointer"
              _hover={{
                backgroundColor: "brand.accentHover",
                textDecoration: "none",
              }}
            >
              {suggestion}
            </ChakraLink>
          ))}
        </Box>
      </VStack>
    </Center>
  );
};
