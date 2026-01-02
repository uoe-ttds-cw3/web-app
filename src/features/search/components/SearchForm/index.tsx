import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

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
import { SearchFormData, searchSchema } from "./schema";

type DeviceResult = {
  id: string;
  name: string;
  manufacturer: string;
  deviceClass: string;
  description: string;
};

const searchDevices = async (query: string): Promise<DeviceResult[]> => {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }
  return response.json();
};

export const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  const { data: results, isFetching } = useQuery({
    queryKey: ["devices", searchQuery],
    queryFn: () => searchDevices(searchQuery!),
    enabled: searchQuery !== null && searchQuery.length > 0,
  });

  const onSubmit = (data: SearchFormData) => {
    setSearchQuery(data.query);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack>
          <Box flex="1">
            <Input
              placeholder="e.g., cardiac pacemaker, insulin pump, surgical tools..."
              size="lg"
              {...register("query")}
            />
            {errors.query && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.query.message}
              </Text>
            )}
          </Box>
          <Button
            type="submit"
            loading={isFetching}
            size="lg"
            colorScheme="blue"
            px={8}
          >
            Search
          </Button>
        </HStack>
      </form>

      {results && results.length > 0 && (
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
      {results && results.length === 0 && searchQuery && !isFetching && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500">
            No results found. Try a different search term.
          </Text>
        </Box>
      )}
    </>
  );
};
