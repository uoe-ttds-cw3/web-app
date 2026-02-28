import { Box, Icon, Text } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

interface ResultsHeaderProps {
  numResults: number;
}

export const ResultsHeader = ({ numResults = 0 }: ResultsHeaderProps) => {
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
