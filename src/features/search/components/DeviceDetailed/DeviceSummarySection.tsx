import { Box, Heading, Text } from "@chakra-ui/react";

export type DeviceSummarySectionProps = {
  usefulSummary: string;
  displaySummary: string;
  showFullSummary: boolean;
  onToggle: () => void;
};

export const DeviceSummarySection = ({
  usefulSummary,
  displaySummary,
  showFullSummary,
  onToggle,
}: DeviceSummarySectionProps) => {
  if (!usefulSummary) {
    return null;
  }

  return (
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
            onClick={onToggle}
          >
            {showFullSummary ? "Show less" : "Show more"}
          </Text>
        )}
      </Box>
    </Box>
  );
};
