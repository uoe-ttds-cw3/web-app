import { Box, Heading, Separator, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { DeviceLookupResponse } from "@/lib/api/types";
import { extractUsefulSummary } from "./utils";

export type DeviceSummarySectionProps = {
  device: DeviceLookupResponse;
};

export const DeviceSummarySection = ({ device }: DeviceSummarySectionProps) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const usefulSummary = device.summary_text
    ? extractUsefulSummary(device.summary_text)
    : null;

  if (!usefulSummary) {
    return null;
  }

  const displaySummary =
    showFullSummary || usefulSummary.length <= 300
      ? usefulSummary
      : `${usefulSummary.substring(0, 300)}...`;

  return (
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
          {usefulSummary.length > 300 && (
            <Text
              color="brand.primary"
              marginTop="8px"
              cursor="pointer"
              textDecoration="underline"
              onClick={() => setShowFullSummary(!showFullSummary)}
            >
              {showFullSummary ? "Show less" : "Show more"}
            </Text>
          )}
        </Box>
      </Box>
    </>
  );
};
