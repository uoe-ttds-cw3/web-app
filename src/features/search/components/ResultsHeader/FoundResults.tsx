import { Box, Text } from "@chakra-ui/react";

export type FoundResultsProps = {
  numResults: number;
};

export const FoundResults = ({ numResults }: FoundResultsProps) => {
  return (
    <Box color="brand.primary">
      <Text display="inline-flex" alignItems="center">
        Found {numResults == 0 ? "no" : numResults >= 500 ? "500+" : numResults}{" "}
        matching device
        {numResults == 1 ? "" : "s"}...
      </Text>
    </Box>
  );
};
