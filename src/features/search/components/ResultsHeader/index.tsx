import { Box } from "@chakra-ui/react";
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
      justifyContent="space-between"
      gap="3"
      width="100%"
    >
      <FoundResults numResults={numResults} />
      <SearchDetailsModal debugInfo={debugInfo} />
    </Box>
  );
};
