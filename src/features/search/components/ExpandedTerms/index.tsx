import { Box, Text } from "@chakra-ui/react";
import type { ExpansionInfo } from "@/lib/api/types";

export type ExpandedTermsProps = {
  expansionInfo: ExpansionInfo;
  onTermClick: (term: string) => void;
};

export const ExpandedTerms = ({
  expansionInfo,
  onTermClick,
}: ExpandedTermsProps) => {
  if (!expansionInfo.expansion_applied) {
    return null;
  }

  const terms = [
    ...(expansionInfo.prf_terms || []),
    ...(expansionInfo.embedding_terms || []),
  ];

  if (terms.length === 0) {
    return null;
  }

  return (
    <Box marginTop="2" marginBottom="2">
      <Text
        fontSize="sm"
        color="ui.textMuted"
        display="inline"
        marginRight="2"
      >
        also searching for:
      </Text>
      {terms.map((termInfo, idx) => (
        <Box
          key={`${termInfo.term}-${idx}`}
          as="button"
          display="inline-flex"
          alignItems="center"
          padding="4px 8px"
          marginRight="2"
          marginBottom="2"
          backgroundColor="brand.accentBg"
          color="brand.primary"
          borderRadius="12px"
          fontSize="sm"
          cursor="pointer"
          _hover={{
            backgroundColor: "brand.accent",
            color: "white",
          }}
          onClick={() => onTermClick(termInfo.term)}
        >
          {termInfo.term}
        </Box>
      ))}
    </Box>
  );
};
