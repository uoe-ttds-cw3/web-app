import { Box, Text } from "@chakra-ui/react";
import type { QueryDebugInfo } from "@/lib/api/types";
import { FoundResults } from "./FoundResults";
import { SearchDetailsModal } from "./SearchDetailsModal";

interface ResultsHeaderProps {
  numResults: number;
  debugInfo?: QueryDebugInfo | null;
}

export const ResultsHeader = ({
  numResults = 0,
  debugInfo,
}: ResultsHeaderProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      gap="2"
      flexWrap="wrap"
    >
      <FoundResults numResults={numResults} />
      {debugInfo && (
        <Text fontSize="xs" color="ui.textMuted" lineHeight="1">
          ·
        </Text>
      )}
      <SearchDetailsModal debugInfo={debugInfo} />
    </Box>
  );
};
