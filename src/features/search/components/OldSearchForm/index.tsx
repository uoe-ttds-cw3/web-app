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
  Badge,
} from "@chakra-ui/react";
import { SearchFormData, searchSchema } from "./schema";
import type { SearchResponse, SearchResultItem } from "@/lib/api/types";

const searchDevices = async (query: string): Promise<SearchResponse> => {
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(query)}&limit=20`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }
  return response.json();
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDecisionColor = (decision: string | null): string => {
  if (!decision) return "gray";
  if (decision.toLowerCase().includes("equivalent")) return "green";
  if (decision.toLowerCase().includes("not")) return "red";
  return "blue";
};

const DeviceCard = ({ device }: { device: SearchResultItem }) => {
  return (
    <Card.Root>
      <Card.Body>
        <VStack align="stretch" gap={3}>
          {/* Header row */}
          <HStack justify="space-between" align="start" wrap="wrap" gap={2}>
            <VStack align="start" gap={1}>
              <Text fontSize="xs" color="gray.500" fontFamily="mono">
                {device.submission_number}
              </Text>
              <Heading size="md">{device.device_name}</Heading>
            </VStack>
            {device.panel && (
              <Badge colorPalette="purple" size="sm">
                {device.panel}
              </Badge>
            )}
          </HStack>

          {/* Sponsor */}
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            {device.sponsor}
          </Text>

          {/* Snippet */}
          {device.snippet && (
            <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }}>
              {device.snippet}
            </Text>
          )}

          {/* Footer row */}
          <HStack justify="space-between" wrap="wrap" gap={2} pt={2}>
            <HStack gap={2}>
              {device.product_code && (
                <Badge colorPalette="gray" size="sm">
                  {device.product_code}
                </Badge>
              )}
              {device.decision && (
                <Badge
                  colorPalette={getDecisionColor(device.decision)}
                  size="sm"
                >
                  {device.decision}
                </Badge>
              )}
            </HStack>
            {device.decision_date && (
              <Text fontSize="xs" color="gray.500">
                {formatDate(device.decision_date)}
              </Text>
            )}
          </HStack>

          {/* Relevance score (subtle) */}
          <Text fontSize="xs" color="gray.400">
            Score: {device.relevance_score.toFixed(2)}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export const OldSearchForm = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  const {
    data: response,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["devices", searchQuery],
    queryFn: () => searchDevices(searchQuery!),
    enabled: searchQuery !== null && searchQuery.length > 0,
  });

  const onSubmit = (data: SearchFormData) => {
    setSearchQuery(data.query);
  };

  const results = response?.results ?? [];
  const totalResults = response?.total_results ?? 0;
  const debugInfo = response?.debug_info;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack>
          <Box flex="1">
            <Input
              placeholder='e.g., pacemaker, "insulin pump", catheter NOT urinary'
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
            colorPalette="blue"
            px={8}
          >
            Search
          </Button>
        </HStack>
      </form>

      {/* Error state */}
      {error && (
        <Box textAlign="center" py={6}>
          <Text color="red.500">
            Error: {error instanceof Error ? error.message : "Search failed"}
          </Text>
        </Box>
      )}

      {/* Results */}
      {results.length > 0 && (
        <VStack gap={4} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="lg">
              Results ({totalResults.toLocaleString()})
            </Heading>
            {debugInfo && (
              <Text fontSize="xs" color="gray.500">
                {debugInfo.retrieval_time_ms.toFixed(0)}ms
              </Text>
            )}
          </HStack>

          {/* Debug info (collapsible in future) */}
          {debugInfo && debugInfo.processed_terms.length > 0 && (
            <Text fontSize="xs" color="gray.500">
              Searched: {debugInfo.processed_terms.join(", ")}
              {debugInfo.phrases_detected.length > 0 &&
                ` | Phrases: ${debugInfo.phrases_detected
                  .map((p: any) => `"${p.join(" ")}"`)
                  .join(", ")}`}
            </Text>
          )}

          <Stack gap={4}>
            {results.map((device: any) => (
              <DeviceCard key={device.submission_number} device={device} />
            ))}
          </Stack>
        </VStack>
      )}

      {/* No Results State */}
      {results.length === 0 && searchQuery && !isFetching && !error && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500">
            No results found. Try a different search term.
          </Text>
        </Box>
      )}
    </>
  );
};
