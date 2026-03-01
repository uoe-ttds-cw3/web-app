import { Box, Heading, Text } from "@chakra-ui/react";

export type IndicationsForUseSectionProps = {
  indicationsForUse: string;
  showFull: boolean;
  onToggle: () => void;
};

export const IndicationsForUseSection = ({
  indicationsForUse,
  showFull,
  onToggle,
}: IndicationsForUseSectionProps) => {
  if (!indicationsForUse) {
    return null;
  }

  const displayText =
    showFull || indicationsForUse.length <= 300
      ? indicationsForUse
      : `${indicationsForUse.substring(0, 300)}...`;

  return (
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
          {displayText}
        </Text>
        {indicationsForUse.length > 300 && (
          <Text
            color="brand.primary"
            marginTop="8px"
            cursor="pointer"
            textDecoration="underline"
            onClick={onToggle}
          >
            {showFull ? "Show less" : "Show more"}
          </Text>
        )}
      </Box>
    </Box>
  );
};
