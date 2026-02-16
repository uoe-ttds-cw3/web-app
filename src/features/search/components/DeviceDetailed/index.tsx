import { Box, Text, Heading, Grid, Badge, Separator, Link as ChakraLink, Card, HStack } from "@chakra-ui/react";
import { useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { DeviceLookupResponse, LineageResponse, SafetyProfileResponse } from "@/lib/api/types";

type DeviceDetailedProps = {
  device: DeviceLookupResponse;
  lineage: LineageResponse | null;
  safety: SafetyProfileResponse | null;
};

export const DeviceDetailed = ({ device, lineage, safety }: DeviceDetailedProps) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showFullIfu, setShowFullIfu] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // try to find the useful section of the summary text instead of showing raw pdf header
  const extractUsefulSummary = (text: string): string => {
    // look for common section headings in fda 510(k) summaries
    const sectionPatterns = [
      /indications?\s+for\s+use/i,
      /device\s+description/i,
      /predicate\s+device/i,
      /intended\s+use/i,
      /summary\s+of\s+submission/i,
    ];

    for (const pattern of sectionPatterns) {
      const match = text.search(pattern);
      if (match !== -1) {
        return text.substring(match);
      }
    }

    // fallback: skip past the fda letter header (usually starts with date, address, "Re: K...")
    const reMatch = text.search(/Re:\s*K\d/i);
    if (reMatch !== -1) {
      // find the next paragraph after the "Re:" line
      const afterRe = text.indexOf('\n', reMatch + 10);
      if (afterRe !== -1) {
        return text.substring(afterRe).trim();
      }
    }

    // last fallback: return as-is
    return text;
  };

  const usefulSummary = device.summary_text ? extractUsefulSummary(device.summary_text) : null;
  const truncatedSummary = usefulSummary && usefulSummary.length > 300
    ? usefulSummary.substring(0, 300) + '...'
    : usefulSummary;
  const displaySummary = showFullSummary ? usefulSummary : truncatedSummary;

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
              href={`https://www.accessdata.fda.gov/cdrh_docs/pdf${device.date_received.slice(2, 4).replace(/^0/, '')}/${device.submission_number}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              color="brand.primary"
              fontSize="sm"
              textDecoration="underline"
            >
              view fda document
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

      {/* feature flags */}
      <Separator marginY="16px" />
      <Box marginBottom="24px">
        <Heading size="md" color="brand.primary" marginBottom="12px">
          Feature Flags
        </Heading>
        <HStack gap="3" flexWrap="wrap">
          <Badge colorPalette={device.has_clinical_data ? "green" : "gray"} variant="subtle" padding="4px 8px">
            clinical data
          </Badge>
          <Badge colorPalette={device.has_sterilization ? "green" : "gray"} variant="subtle" padding="4px 8px">
            sterilization
          </Badge>
          <Badge colorPalette={device.has_biocompatibility ? "green" : "gray"} variant="subtle" padding="4px 8px">
            biocompatibility
          </Badge>
          <Badge colorPalette={device.has_software ? "green" : "gray"} variant="subtle" padding="4px 8px">
            software
          </Badge>
          <Badge colorPalette={device.has_electrical_safety ? "green" : "gray"} variant="subtle" padding="4px 8px">
            electrical safety
          </Badge>
        </HStack>
      </Box>

      {/* indications for use */}
      {device.indications_for_use && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Indications for Use
            </Heading>
            <Box
              padding="12px"
              borderRadius="4px"
              backgroundColor="ui.surface"
              borderWidth="1px"
              borderColor="ui.border"
            >
              <Text color="black" whiteSpace="pre-wrap">
                {showFullIfu || device.indications_for_use.length <= 300
                  ? device.indications_for_use
                  : device.indications_for_use.substring(0, 300) + '...'}
              </Text>
              {device.indications_for_use.length > 300 && (
                <Text
                  color="brand.primary"
                  marginTop="8px"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => setShowFullIfu(!showFullIfu)}
                >
                  {showFullIfu ? 'show less' : 'show more'}
                </Text>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* device description */}
      {device.device_description && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Device Description
            </Heading>
            <Box
              padding="12px"
              borderRadius="4px"
              backgroundColor="ui.surface"
              borderWidth="1px"
              borderColor="ui.border"
            >
              <Text color="black" whiteSpace="pre-wrap">
                {showFullDescription || device.device_description.length <= 300
                  ? device.device_description
                  : device.device_description.substring(0, 300) + '...'}
              </Text>
              {device.device_description.length > 300 && (
                <Text
                  color="brand.primary"
                  marginTop="8px"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? 'show less' : 'show more'}
                </Text>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* materials */}
      {device.materials && device.materials.length > 0 && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Materials
            </Heading>
            <HStack gap="2" flexWrap="wrap">
              {device.materials.map((material) => (
                <Badge key={material} variant="subtle" colorPalette="gray" padding="4px 8px">
                  {material}
                </Badge>
              ))}
            </HStack>
          </Box>
        </>
      )}

      {/* standards referenced */}
      {device.standards_referenced && device.standards_referenced.length > 0 && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Standards Referenced
            </Heading>
            <Box>
              {device.standards_referenced.map((standard) => (
                <Text key={standard} fontSize="sm" color="black" marginBottom="4px">
                  {standard}
                </Text>
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* sterilization methods */}
      {device.sterilization_methods && device.sterilization_methods.length > 0 && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Sterilization Methods
            </Heading>
            <HStack gap="2" flexWrap="wrap">
              {device.sterilization_methods.map((method) => (
                <Badge key={method} variant="subtle" colorPalette="gray" padding="4px 8px">
                  {method}
                </Badge>
              ))}
            </HStack>
          </Box>
        </>
      )}

      {/* 510(k) summary - collapsible */}
      {usefulSummary && usefulSummary.length > 0 && (
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
              {usefulSummary && usefulSummary.length > 300 && (
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
            {safety.event_breakdown.total > 0 && (() => {
              const severityOrder = ['Death', 'Injury', 'Malfunction', 'Other', 'Unknown', 'Unclassified'];
              const severityColors: Record<string, string> = {
                'Death': '#DC2626',
                'Injury': '#D97706',
                'Malfunction': 'var(--chakra-colors-brand-primary)',
                'Other': '#6B7280',
                'Unknown': '#9CA3AF',
                'Unclassified': '#9CA3AF',
              };

              const sortedEvents = Object.entries(safety.event_breakdown.counts)
                .map(([type, count]) => ({
                  type: type.trim() === '' ? 'Unclassified' : type,
                  count,
                }))
                .sort((a, b) => {
                  const aIdx = severityOrder.indexOf(a.type);
                  const bIdx = severityOrder.indexOf(b.type);
                  return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
                });

              return (
                <Box marginBottom="12px">
                  <Text color="brand.primary" fontWeight="bold" marginBottom="4px">
                    Event Breakdown:
                  </Text>
                  {sortedEvents.map(({ type, count }) => {
                    const percentage = ((count / safety.event_breakdown.total) * 100).toFixed(1);
                    const color = severityColors[type] || '#6B7280';
                    return (
                      <Text key={type} fontSize="sm" style={{ color }}>
                        {type}: {formatNumber(count)} ({percentage}%)
                      </Text>
                    );
                  })}
                  {/* show chart if 2+ event types exist */}
                  {sortedEvents.length >= 2 && (
                    <Box marginTop="16px">
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={sortedEvents.map(({ type, count }) => ({ type, count, percentage: ((count / safety.event_breakdown.total) * 100).toFixed(1) }))}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis type="number" />
                          <YAxis dataKey="type" type="category" width={150} />
                          <Tooltip />
                          <Bar dataKey="count">
                            {sortedEvents.map(({ type }) => (
                              <Cell key={type} fill={severityColors[type] || '#6B7280'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </Box>
              );
            })()}
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
