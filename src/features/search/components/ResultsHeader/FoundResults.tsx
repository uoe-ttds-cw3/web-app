import { Box, Icon, Text } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

export type FoundResultsProps = {
  numResults: number;
};

export const FoundResults = ({ numResults }: FoundResultsProps) => {
  return (
    <Box color="brand.primary">
      <Text display="inline-flex" alignItems="center">
        <Icon as={FaSearch} color="brand.primary" marginRight="8px" boxSize="4" />
        Found {numResults == 0 ? "no" : numResults >= 500 ? "500+" : numResults}{" "}
        device
        {numResults == 1 ? "" : "s"}...
      </Text>
    </Box>
  );
};
