import { Box, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export type DidYouMeanSuggestionProps = {
  suggestion: string;
  onSelect?: () => void;
};

export const DidYouMeanSuggestion = ({
  suggestion,
  onSelect,
}: DidYouMeanSuggestionProps) => {
  const router = useRouter();
  const href = `/?${new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(router.query).filter(
        ([, value]) => typeof value === "string",
      ) as Array<[string, string]>,
    ),
    q: suggestion,
  }).toString()}`;

  return (
    <Box marginBottom="3">
      <Text fontSize="sm" color="ui.textMuted" display="inline">
        Did you mean{" "}
      </Text>
      <ChakraLink
        asChild
        color="brand.primary"
        fontWeight="semibold"
        fontSize="sm"
        textDecoration="underline"
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
      >
        <Link href={href} onClick={onSelect}>
          {suggestion}
        </Link>
      </ChakraLink>
      <Text fontSize="sm" color="ui.textMuted" display="inline">
        ?
      </Text>
    </Box>
  );
};
