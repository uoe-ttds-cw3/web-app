import { Box, Heading, Text } from "@chakra-ui/react";

export type DeviceDescriptionSectionProps = {
  deviceDescription: string;
  showFull: boolean;
  onToggle: () => void;
};

export const DeviceDescriptionSection = ({
  deviceDescription,
  showFull,
  onToggle,
}: DeviceDescriptionSectionProps) => {
  if (!deviceDescription) {
    return null;
  }

  const displayText =
    showFull || deviceDescription.length <= 300
      ? deviceDescription
      : `${deviceDescription.substring(0, 300)}...`;

  return (
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
          {displayText}
        </Text>
        {deviceDescription.length > 300 && (
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
