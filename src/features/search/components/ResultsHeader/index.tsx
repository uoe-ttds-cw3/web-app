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
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      gap="1"
      flexWrap="wrap"
    >
      <FoundResults numResults={numResults} />
      <SearchDetailsModal debugInfo={debugInfo} />
    </Box>
  );
};
