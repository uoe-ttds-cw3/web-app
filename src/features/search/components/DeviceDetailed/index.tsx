import { Box, Text, Heading, Grid, Badge, Separator, Link as ChakraLink, Card } from "@chakra-ui/react";
import { useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { DeviceLookupResponse, LineageResponse, SafetyProfileResponse } from "@/lib/api/types";

type DeviceDetailedProps = {
  device: DeviceLookupResponse;
  lineage: LineageResponse | null;
  safety: SafetyProfileResponse | null;
};

export const DeviceDetailed = ({ device, lineage, safety }: DeviceDetailedProps) => {
  const [showFullSummary, setShowFullSummary] = useState(false);

  // format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  let yearpart = '';

  if (device.date_received) {
    const year = parseInt(device.date_received.slice(0, 4), 10);
  
    if (year >= 2000) {
      // Last two digits, remove leading zero
      yearpart = device.date_received.slice(2, 4).replace(/^0/, '');
    } 
  }

  // Truncate summary text to 300 chars
  const truncatedSummary = device.summary_text && device.summary_text.length > 300
    ? device.summary_text.substring(0, 300) + '...'
    : device.summary_text;

  const displaySummary = showFullSummary ? device.summary_text : truncatedSummary;

  return (
    <Card.Root
      backgroundColor="white"
      padding="24px"
      borderRadius="12px"
      maxWidth="1200px"
      borderWidth="1px"
      borderColor="ui.border"
    >
      {/* header */}
      <Box marginBottom="24px">
        <Heading size="xl" color="brand.primary" marginBottom="8px">
          {device.device_name}
        </Heading>
        <Box display="flex" alignItems="center" gap="8px" marginBottom="8px">
          <Badge colorScheme="gray" fontSize="md" padding="4px 8px">
            {device.submission_number}
          </Badge>
          {/* link to the official fda 510(k) pdf using date_received for the url path */}
          {device.date_received && (
            <ChakraLink
              href={`https://www.accessdata.fda.gov/cdrh_docs/pdf${yearpart}/${device.submission_number}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              color="brand.primary"
              fontSize="sm"
              textDecoration="underline"
            >
              View FDA Document
            </ChakraLink>
          )}
        </Box>
        <Text fontSize="lg" color="black">
          Manufacturer: <Box as="span" fontWeight="bold">{device.sponsor}</Box>
        </Text>
      </Box>

      <Separator marginY="16px" />

      {/* metadata grid - responsive */}
      <Box marginBottom="24px">
        <Heading size="md" color="brand.primary" marginBottom="12px">
          Device Information
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="12px">
          <Box>
            <Text color="brand.primary" fontWeight="bold">Product Code:</Text>
            <Text color="black">{device.product_code || 'N/A'}</Text>
          </Box>
          <Box>
            <Text color="brand.primary" fontWeight="bold">Panel:</Text>
            <Text color="black">{device.panel || 'N/A'}</Text>
          </Box>
          <Box>
            <Text color="brand.primary" fontWeight="bold">Decision:</Text>
            <Text color="black">{device.decision || 'N/A'}</Text>
          </Box>
          <Box>
            <Text color="brand.primary" fontWeight="bold">Decision Date:</Text>
            <Text color="black">{device.decision_date || 'N/A'}</Text>
          </Box>
        </Grid>
      </Box>

      {/* 510(k) summary - collapsible */}
      {device.summary_text && device.summary_text.length > 0 && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              510(k) Summary
            </Heading>
            <Box
              padding="12px"
              borderRadius="4px"
              backgroundColor="ui.surface"
              borderWidth="1px"
              borderColor="ui.border"
            >
              <Text color="black" whiteSpace="pre-wrap">
                {displaySummary}
              </Text>
              {device.summary_text.length > 300 && (
                <Text
                  color="brand.primary"
                  marginTop="8px"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => setShowFullSummary(!showFullSummary)}
                >
                  {showFullSummary ? 'show less' : 'show more'}
                </Text>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* lineage section */}
      {lineage && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Predicate Lineage
            </Heading>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="12px" marginBottom="12px">
              <Box>
                <Text color="brand.primary" fontWeight="bold">Ancestors:</Text>
                <Text color="black">{lineage.ancestor_count}</Text>
              </Box>
              <Box>
                <Text color="brand.primary" fontWeight="bold">Descendants:</Text>
                <Text color="black">{lineage.descendant_count}</Text>
              </Box>
            </Grid>
            {lineage.direct_predicates.length > 0 && (
              <Box marginBottom="8px">
                <Text color="brand.primary" fontWeight="bold">Direct Predicates:</Text>
                <Box>
                  {lineage.direct_predicates.map((predicate, index) => (
                    <Box key={predicate} display="inline">
                      <Link href={`/devices/${predicate}`}>
                        <ChakraLink color="brand.primary" textDecoration="underline" cursor="pointer">
                          {predicate}
                        </ChakraLink>
                      </Link>
                      {index < lineage.direct_predicates.length - 1 && (
                        <Text display="inline" color="black" marginX="4px">,</Text>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            {lineage.pagerank !== null && (
              <Box>
                <Text color="brand.primary" fontWeight="bold">PageRank Score:</Text>
                <Text color="black" fontFamily="monospace">
                  {lineage.pagerank.toFixed(7)}
                </Text>
              </Box>
            )}
          </Box>
        </>
      )}

      {/* safety section */}
      {safety && (
        <>
          <Separator marginY="16px" />
          <Box>
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Safety Data
            </Heading>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="12px" marginBottom="12px">
              <Box>
                <Text color="brand.primary" fontWeight="bold">Recalls:</Text>
                <Text
                  color={
                    safety.recall_count === 0
                      ? 'status.safe'
                      : safety.recall_count <= 5
                      ? 'status.warning'
                      : 'status.danger'
                  }
                  fontWeight="bold"
                  fontSize="lg"
                >
                  {safety.recall_count}
                </Text>
              </Box>
              <Box>
                <Text color="brand.primary" fontWeight="bold">Adverse Events:</Text>
                <Text color="black" fontSize="lg">
                  {formatNumber(safety.adverse_event_count)}
                </Text>
              </Box>
            </Grid>
            {safety.event_breakdown.total > 0 && (
              <Box marginBottom="12px">
                <Text color="brand.primary" fontWeight="bold" marginBottom="4px">
                  Event Breakdown:
                </Text>
                {Object.entries(safety.event_breakdown.counts).map(([type, count]) => {
                  const percentage = ((count / safety.event_breakdown.total) * 100).toFixed(1);
                  return (
                    <Text key={type} color="black" fontSize="sm">
                      {type}: {formatNumber(count)} ({percentage}%)
                    </Text>
                  );
                })}
                {/* show chart if 2+ event types exist */}
                {Object.keys(safety.event_breakdown.counts).length >= 2 && (
                  <Box marginTop="16px">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={Object.entries(safety.event_breakdown.counts).map(([type, count]) => ({
                          type,
                          count,
                          percentage: ((count / safety.event_breakdown.total) * 100).toFixed(1)
                        }))}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis dataKey="type" type="category" width={150} />
                        <Tooltip />
                        <Bar dataKey="count" fill="var(--chakra-colors-brand-primary)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </Box>
            )}
            {safety.most_recent_recall_date && (
              <Box>
                <Text color="brand.primary" fontWeight="bold">Most Recent Recall:</Text>
                <Text color="black">{safety.most_recent_recall_date}</Text>
              </Box>
            )}
          </Box>
        </>
      )}
    </Card.Root>
  );
};
