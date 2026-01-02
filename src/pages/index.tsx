import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";

type DeviceResult = {
  id: string;
  name: string;
  manufacturer: string;
  deviceClass: string;
  description: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DeviceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    // TODO: Replace with actual API call
    setTimeout(() => {
      // Mock results for now
      setResults([
        {
          id: "1",
          name: "Cardiac Pacemaker",
          manufacturer: "Medtronic Inc.",
          deviceClass: "Class III",
          description:
            "Implantable device that helps control abnormal heart rhythms.",
        },
        {
          id: "2",
          name: "Blood Glucose Monitor",
          manufacturer: "Abbott Laboratories",
          deviceClass: "Class II",
          description:
            "Portable device for measuring blood glucose concentration.",
        },
        {
          id: "3",
          name: "Surgical Suture",
          manufacturer: "Johnson & Johnson",
          deviceClass: "Class I",
          description:
            "Medical device used to hold body tissues together after injury or surgery.",
        },
      ]);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Stack spaceY={8}>
      <VStack spaceY={4} align="stretch">
        <Heading size="2xl">Medical Device Search</Heading>
        <Text color="gray.600" _dark={{ color: "gray.400" }}>
          Search for medical devices using natural language queries
        </Text>
        <HStack>
          <Input
            placeholder="e.g., cardiac pacemaker, insulin pump, surgical tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            size="lg"
            flex="1"
          />
          <Button
            onClick={handleSearch}
            loading={isSearching}
            size="lg"
            colorScheme="blue"
            px={8}
          >
            Search
          </Button>
        </HStack>
      </VStack>

      {/* Results Section */}
      {results.length > 0 && (
        <VStack spaceY={4} align="stretch">
          <Heading size="lg">Results ({results.length})</Heading>

          <Stack spaceY={4}>
            {results.map((device) => (
              <Card.Root key={device.id}>
                <Card.Body>
                  <VStack align="stretch" spaceY={2}>
                    <HStack justify="space-between" align="start">
                      <Heading size="md">{device.name}</Heading>
                      <Box
                        px={3}
                        py={1}
                        bg="blue.100"
                        color="blue.800"
                        _dark={{ bg: "blue.900", color: "blue.200" }}
                        borderRadius="md"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        {device.deviceClass}
                      </Box>
                    </HStack>

                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                    >
                      {device.manufacturer}
                    </Text>

                    <Text>{device.description}</Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </Stack>
        </VStack>
      )}

      {/* No Results State */}
      {results.length === 0 && query && !isSearching && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500">
            No results found. Try a different search term.
          </Text>
        </Box>
      )}
    </Stack>
  );
}
