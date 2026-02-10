import { Box, Text, Heading, Grid, Badge, Separator } from "@chakra-ui/react";
import { useState } from "react";
import type { DeviceLookupResponse, LineageResponse, SafetyProfileResponse } from "@/lib/api/types";

type DeviceDetailedProps = {
  device: DeviceLookupResponse;
  lineage: LineageResponse | null;
  safety: SafetyProfileResponse | null;
};

export const DeviceDetailed = ({ device, lineage, safety }: DeviceDetailedProps) => {
  const [showFullSummary, setShowFullSummary] = useState(false);

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Truncate summary text to 500 chars
  const truncatedSummary = device.summary_text && device.summary_text.length > 500
    ? device.summary_text.substring(0, 500) + '...'
    : device.summary_text;

  const displaySummary = showFullSummary ? device.summary_text : truncatedSummary;

  return (
    <Box backgroundColor="#D2D2D2" padding="24px" borderRadius="8px" maxWidth="1200px">
      {/* Header */}
      <Box marginBottom="24px">
        <Heading size="xl" color="#266429" marginBottom="8px">
          {device.device_name}
        </Heading>
        <Badge colorScheme="gray" fontSize="md" marginBottom="8px">
          {device.submission_number}
        </Badge>
        <Text fontSize="lg" color="black">
          Sponsor: <Box as="span" fontWeight="bold">{device.sponsor}</Box>
        </Text>
      </Box>

      <Separator marginY="16px" />

      {/* Metadata Grid */}
      <Box marginBottom="24px">
        <Heading size="md" color="#266429" marginBottom="12px">
          Device Information
        </Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap="12px">
          <Box>
            <Text color="#266429" fontWeight="bold">Product Code:</Text>
            <Text color="black">{device.product_code || 'N/A'}</Text>
          </Box>
          <Box>
            <Text color="#266429" fontWeight="bold">Panel:</Text>
            <Text color="black">{device.panel || 'N/A'}</Text>
          </Box>
          <Box>
            <Text color="#266429" fontWeight="bold">Decision:</Text>
            <Text color="black">{device.decision || 'N/A'}</Text>
          </Box>
          <Box>
            <Text color="#266429" fontWeight="bold">Decision Date:</Text>
            <Text color="black">{device.decision_date || 'N/A'}</Text>
          </Box>
        </Grid>
      </Box>

      {/* Summary Text */}
      {device.summary_text && device.summary_text.length > 0 && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="#266429" marginBottom="12px">
              Summary
            </Heading>
            <Box
              padding="12px"
              borderRadius="4px"
              backgroundColor="white"
              border="1px solid #ccc"
            >
              <Text color="black" whiteSpace="pre-wrap">
                {displaySummary}
              </Text>
              {device.summary_text.length > 500 && (
                <Text
                  color="#266429"
                  marginTop="8px"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => setShowFullSummary(!showFullSummary)}
                >
                  {showFullSummary ? 'Show less' : 'Show more'}
                </Text>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* Lineage Section */}
      {lineage && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="#266429" marginBottom="12px">
              Predicate Lineage
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap="12px" marginBottom="12px">
              <Box>
                <Text color="#266429" fontWeight="bold">Ancestors:</Text>
                <Text color="black">{lineage.ancestor_count}</Text>
              </Box>
              <Box>
                <Text color="#266429" fontWeight="bold">Descendants:</Text>
                <Text color="black">{lineage.descendant_count}</Text>
              </Box>
            </Grid>
            {lineage.direct_predicates.length > 0 && (
              <Box marginBottom="8px">
                <Text color="#266429" fontWeight="bold">Direct Predicates:</Text>
                <Text color="black">{lineage.direct_predicates.join(', ')}</Text>
              </Box>
            )}
            {lineage.pagerank !== null && (
              <Box>
                <Text color="#266429" fontWeight="bold">PageRank Score:</Text>
                <Text color="black" fontFamily="monospace">
                  {lineage.pagerank.toFixed(7)}
                </Text>
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Safety Section */}
      {safety && (
        <>
          <Separator marginY="16px" />
          <Box>
            <Heading size="md" color="#266429" marginBottom="12px">
              Safety Data
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap="12px" marginBottom="12px">
              <Box>
                <Text color="#266429" fontWeight="bold">Recalls:</Text>
                <Text
                  color={
                    safety.recall_count === 0
                      ? 'green.600'
                      : safety.recall_count <= 5
                      ? 'yellow.600'
                      : 'red.600'
                  }
                  fontWeight="bold"
                  fontSize="lg"
                >
                  {safety.recall_count}
                </Text>
              </Box>
              <Box>
                <Text color="#266429" fontWeight="bold">Adverse Events:</Text>
                <Text color="black" fontSize="lg">
                  {formatNumber(safety.adverse_event_count)}
                </Text>
              </Box>
            </Grid>
            {safety.event_breakdown.total > 0 && (
              <Box marginBottom="12px">
                <Text color="#266429" fontWeight="bold" marginBottom="4px">
                  Event Breakdown:
                </Text>
                {Object.entries(safety.event_breakdown.counts).map(([type, count]) => (
                  <Text key={type} color="black" fontSize="sm">
                    {type}: {formatNumber(count)}
                  </Text>
                ))}
              </Box>
            )}
            {safety.most_recent_recall_date && (
              <Box>
                <Text color="#266429" fontWeight="bold">Most Recent Recall:</Text>
                <Text color="black">{safety.most_recent_recall_date}</Text>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
