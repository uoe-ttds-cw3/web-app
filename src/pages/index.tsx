import { SearchForm } from "@/features/search/components/SearchForm";
import { Heading, Stack, Text, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Stack spaceY={8}>
      {/* Search Section */}
      <VStack spaceY={4} align="stretch">
        <Heading size="2xl">Medical Device Search</Heading>
        <Text color="gray.600" _dark={{ color: "gray.400" }}>
          Search for medical devices using natural language queries
        </Text>
        <SearchForm />
      </VStack>
    </Stack>
  );
}
