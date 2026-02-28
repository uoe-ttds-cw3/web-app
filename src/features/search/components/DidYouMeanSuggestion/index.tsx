import { Box, Text } from "@chakra-ui/react";

export type DidYouMeanSuggestionProps = {
  suggestion: string;
  onSelect: () => void;
};

export const DidYouMeanSuggestion = ({
  suggestion,
  onSelect,
}: DidYouMeanSuggestionProps) => {
  return (
    <Box marginBottom="3">
      <Text fontSize="sm" color="ui.textMuted" display="inline">
        Did you mean{" "}
      </Text>
      <Box
        as="button"
        display="inline"
        color="brand.primary"
        fontWeight="semibold"
        fontSize="sm"
        textDecoration="underline"
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        onClick={onSelect}
      >
        {suggestion}
      </Box>
      <Text fontSize="sm" color="ui.textMuted" display="inline">
        ?
      </Text>
    </Box>
  );
};
