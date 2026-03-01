import { Box, Text } from "@chakra-ui/react";

export type FoundResultsProps = {
  numResults: number;
};

export const FoundResults = ({ numResults }: FoundResultsProps) => {
  const displayCount = numResults == 0 ? "No" : String(numResults);

  return (
    <Box color="ui.textMuted">
      <Text display="inline-flex" alignItems="center">
        {displayCount} matching device
        {numResults == 1 ? "" : "s"}
      </Text>
    </Box>
  );
};
