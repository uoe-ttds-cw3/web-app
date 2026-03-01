import {
  Box,
  Grid,
  Heading,
  Badge,
  HStack,
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
import type {
  DeviceSafetyData,
  SafetyProfileResponse,
} from "@/lib/api/types";
import { formatDate, formatNumber } from "./utils";

export type ProductCodeSafetySectionProps = {
  safety: SafetyProfileResponse;
  deviceSafety: DeviceSafetyData | null;
  productCode: string | null;
};

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

export const ProductCodeSafetySection = ({
  safety,
  deviceSafety,
  productCode,
}: ProductCodeSafetySectionProps) => {
  const sortedEvents = Object.entries(safety.event_breakdown.counts)
    .map(([type, count]) => ({
      type: type.trim() === "" ? "Unclassified" : type,
      count,
    }))
    .sort((a, b) => {
      const aIdx = severityOrder.indexOf(a.type);
      const bIdx = severityOrder.indexOf(b.type);
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    });

  return (
    <Box>
      <Heading size="md" color="brand.primary" marginBottom="4px">
        {deviceSafety ? `All ${productCode} Devices` : "Safety Data"}
      </Heading>
      {deviceSafety && (
        <Text fontSize="xs" color="ui.textMuted" marginBottom="12px">
          Aggregate safety data across all devices with product code {productCode}
        </Text>
      )}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap="12px"
        marginBottom="12px"
      >
        <Box>
          <Text color="brand.primary" fontWeight="bold">
            Recalls:
          </Text>
          <Text
            color={
              safety.recall_count === 0
                ? "status.safe"
                : safety.recall_count <= 5
                  ? "status.warning"
                  : "status.danger"
            }
            fontWeight="bold"
            fontSize="lg"
          >
            {safety.recall_count}
          </Text>
        </Box>
        <Box>
          <Text color="brand.primary" fontWeight="bold">
            Adverse Events:
          </Text>
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
          {sortedEvents.map(({ type, count }) => {
            const percentage = (
              (count / safety.event_breakdown.total) *
              100
            ).toFixed(1);
            const color = severityColors[type] || "#6B7280";

            return (
              <Text key={type} fontSize="sm" style={{ color }}>
                {type}: {formatNumber(count)} ({percentage}%)
              </Text>
            );
          })}
          {sortedEvents.length >= 2 && (
            <Box marginTop="16px">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={sortedEvents.map(({ type, count }) => ({
                    type,
                    count,
                    percentage: (
                      (count / safety.event_breakdown.total) *
                      100
                    ).toFixed(1),
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={150} />
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
      )}

      {safety.most_recent_recall_date && (
        <Box>
          <Text color="brand.primary" fontWeight="bold">
            Most Recent Recall:
          </Text>
          <Text color="black" marginBottom="4px">
            {formatDate(safety.most_recent_recall_date)}
          </Text>
        </Box>
      )}

      {safety.recent_recalls.length > 0 && (
        <Box marginTop="12px">
          <Text color="brand.primary" fontWeight="bold" marginBottom="8px">
            Recent Recalls:
          </Text>
          {safety.recent_recalls.slice(0, 5).map((recall) => (
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
                {recall.status && (
                  <Badge
                    colorPalette={
                      recall.status.toLowerCase().includes("completed")
                        ? "green"
                        : recall.status.toLowerCase().includes("terminated")
                          ? "gray"
                          : "yellow"
                    }
                    variant="subtle"
                    fontSize="xs"
                  >
                    {recall.status}
                  </Badge>
                )}
              </HStack>
              {recall.reason && (
                <Text fontSize="sm" color="ui.textMuted" lineClamp={2}>
                  {recall.reason}
                </Text>
              )}
              {recall.firm && (
                <Text fontSize="xs" color="ui.textMuted" marginTop="4px">
                  {recall.firm}
                  {recall.date_initiated
                    ? ` · ${formatDate(recall.date_initiated)}`
                    : ""}
                </Text>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
