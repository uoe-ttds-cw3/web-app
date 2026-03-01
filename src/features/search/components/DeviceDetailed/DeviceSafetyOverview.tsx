import {
  Badge,
  Box,
  Grid,
  HStack,
  Heading,
  Separator,
  Text,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { DeviceLookupResponse, DeviceSafetyData } from "@/lib/api/types";

export type DeviceSafetyOverviewProps = {
  device: DeviceLookupResponse;
  deviceSafety: DeviceSafetyData | null;
  formatDate: (isoDate: string | null) => string;
  formatNumber: (num: number) => string;
};

export const DeviceSafetyOverview = ({
  device,
  deviceSafety,
  formatDate,
  formatNumber,
}: DeviceSafetyOverviewProps) => {
  if (!deviceSafety || (deviceSafety.event_count <= 0 && deviceSafety.recall_count <= 0)) {
    return null;
  }

  return (
    <>
      <Separator marginY="16px" />
      <Box>
        <Heading size="md" color="brand.primary" marginBottom="4px">
          Safety Data for {device.submission_number}
        </Heading>
        <Text fontSize="xs" color="ui.textMuted" marginBottom="12px">
          Adverse events and recalls specific to this 510(k) clearance
        </Text>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap="12px"
          marginBottom="12px"
        >
          <Box>
            <Text color="brand.primary" fontWeight="bold">
              Adverse Events:
            </Text>
            <Text color="black" fontSize="lg" fontWeight="bold">
              {formatNumber(deviceSafety.event_count)}
            </Text>
          </Box>
          <Box>
            <Text color="brand.primary" fontWeight="bold">
              Recalls:
            </Text>
            <Text
              color={
                deviceSafety.recall_count === 0
                  ? "status.safe"
                  : deviceSafety.recall_count <= 3
                    ? "status.warning"
                    : "status.danger"
              }
              fontWeight="bold"
              fontSize="lg"
            >
              {deviceSafety.recall_count}
            </Text>
          </Box>
        </Grid>

        {Object.keys(deviceSafety.breakdown).length > 0 &&
          (() => {
            const severityOrder = [
              "Death",
              "Injury",
              "Malfunction",
              "Other",
              "Unknown",
              "Unclassified",
            ];
            const severityColors: Record<string, string> = {
              Death: "var(--chakra-colors-status-danger)",
              Injury: "var(--chakra-colors-status-warning)",
              Malfunction: "var(--chakra-colors-brand-primary)",
              Other: "#6B7280",
              Unknown: "#9CA3AF",
              Unclassified: "#000000",
            };

            const sortedEvents = Object.entries(deviceSafety.breakdown)
              .map(([type, count]) => ({
                type: type.trim() === "" ? "Unclassified" : type,
                count,
              }))
              .sort((a, b) => {
                const aIdx = severityOrder.indexOf(a.type);
                const bIdx = severityOrder.indexOf(b.type);
                return (
                  (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx)
                );
              });

            const total = sortedEvents.reduce((sum, e) => sum + e.count, 0);

            return (
              <Box marginBottom="12px">
                <Text color="brand.primary" fontWeight="bold" marginBottom="4px">
                  Event Breakdown:
                </Text>
                {sortedEvents.map(({ type, count }) => {
                  const percentage =
                    total > 0 ? ((count / total) * 100).toFixed(1) : "0";
                  const color = severityColors[type] || "#6B7280";
                  return (
                    <Text key={type} fontSize="sm" style={{ color }}>
                      {type}: {formatNumber(count)} ({percentage}%)
                    </Text>
                  );
                })}
                {sortedEvents.length >= 2 && (
                  <Box marginTop="16px">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={sortedEvents.map(({ type, count }) => ({
                          type,
                          count,
                          percentage:
                            total > 0 ? ((count / total) * 100).toFixed(1) : "0",
                        }))}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis dataKey="type" type="category" width={120} />
                        <RechartsTooltip />
                        <Bar dataKey="count">
                          {sortedEvents.map(({ type }) => (
                            <Cell
                              key={type}
                              fill={severityColors[type] || "#6B7280"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </Box>
            );
          })()}

        {deviceSafety.problem_codes &&
          Object.keys(deviceSafety.problem_codes).length > 0 && (
            <Box marginTop="12px">
              <Text color="brand.primary" fontWeight="bold" marginBottom="8px">
                Reported Device Problems:
              </Text>
              {Object.entries(deviceSafety.problem_codes)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([problem, count]) => {
                  const total = deviceSafety.event_count || 1;
                  const pct = ((count / total) * 100).toFixed(1);
                  return (
                    <HStack
                      key={problem}
                      justifyContent="space-between"
                      paddingY="4px"
                      borderBottomWidth="1px"
                      borderColor="ui.borderLight"
                    >
                      <Text fontSize="sm" color="ui.text">
                        {problem}
                      </Text>
                      <Text fontSize="sm" color="ui.textMuted" flexShrink={0}>
                        {count.toLocaleString()} ({pct}%)
                      </Text>
                    </HStack>
                  );
                })}
            </Box>
          )}

        {deviceSafety.patient_outcomes &&
          Object.keys(deviceSafety.patient_outcomes).length > 0 && (
            <Box marginTop="12px">
              <Text color="brand.primary" fontWeight="bold" marginBottom="8px">
                Patient Outcomes:
              </Text>
              {Object.entries(deviceSafety.patient_outcomes)
                .sort(([, a], [, b]) => b - a)
                .map(([outcome, count]) => (
                  <HStack
                    key={outcome}
                    justifyContent="space-between"
                    paddingY="4px"
                    borderBottomWidth="1px"
                    borderColor="ui.borderLight"
                  >
                    <Text
                      fontSize="sm"
                      color={
                        outcome === "Death"
                          ? "status.danger"
                          : outcome === "Life Threatening"
                            ? "status.warning"
                            : "ui.text"
                      }
                    >
                      {outcome}
                    </Text>
                    <Text fontSize="sm" color="ui.textMuted" flexShrink={0}>
                      {count.toLocaleString()}
                    </Text>
                  </HStack>
                ))}
            </Box>
          )}

        {deviceSafety.recent_events.length > 0 && (
          <Box marginTop="12px">
            <Text color="brand.primary" fontWeight="bold" marginBottom="8px">
              Recent Adverse Events:
            </Text>
            {deviceSafety.recent_events.slice(0, 5).map((evt, idx) => (
              <Box
                key={`${evt.date}-${idx}`}
                padding="8px 12px"
                marginBottom="8px"
                borderRadius="6px"
                borderWidth="1px"
                borderColor="ui.border"
                backgroundColor="ui.surface"
              >
                <HStack justifyContent="space-between" marginBottom="4px">
                  <Badge
                    colorPalette={
                      evt.type === "Death"
                        ? "red"
                        : evt.type === "Injury"
                          ? "yellow"
                          : "gray"
                    }
                    variant="subtle"
                    fontSize="xs"
                  >
                    {evt.type}
                  </Badge>
                  <Text fontSize="xs" color="ui.textMuted">
                    {formatDate(evt.date)}
                  </Text>
                </HStack>
                {evt.description && (
                  <Text fontSize="sm" color="ui.textMuted" lineClamp={2}>
                    {evt.description}
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        )}

        {deviceSafety.recent_recalls.length > 0 && (
          <Box marginTop="12px">
            <Text color="brand.primary" fontWeight="bold" marginBottom="8px">
              Device Recalls:
            </Text>
            {deviceSafety.recent_recalls.slice(0, 5).map((recall) => (
              <Box
                key={recall.event_number}
                padding="8px 12px"
                marginBottom="8px"
                borderRadius="6px"
                borderWidth="1px"
                borderColor="ui.border"
                backgroundColor="ui.surface"
              >
                <HStack justifyContent="space-between" marginBottom="4px">
                  <Text fontSize="sm" fontWeight="bold" color="black">
                    {recall.event_number}
                  </Text>
                  <Badge
                    colorPalette={
                      recall.classification.includes("I") &&
                      !recall.classification.includes("II")
                        ? "red"
                        : recall.classification.includes("II")
                          ? "yellow"
                          : "gray"
                    }
                    variant="subtle"
                    fontSize="xs"
                  >
                    {recall.classification}
                  </Badge>
                </HStack>
                {recall.reason && (
                  <Text fontSize="sm" color="ui.textMuted" lineClamp={2}>
                    {recall.reason}
                  </Text>
                )}
                {recall.firm && (
                  <Text fontSize="xs" color="ui.textMuted" marginTop="4px">
                    {recall.firm}
                    {recall.date ? ` · ${formatDate(recall.date)}` : ""}
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};
