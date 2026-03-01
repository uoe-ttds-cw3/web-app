import { Box, Heading, Separator, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { DeviceLookupResponse } from "@/lib/api/types";

export type DeviceDescriptionSectionProps = {
  device: DeviceLookupResponse;
};

export const DeviceDescriptionSection = ({
  device,
}: DeviceDescriptionSectionProps) => {
  const [showFull, setShowFull] = useState(false);
  const deviceDescription = device.device_description;

  if (!deviceDescription) {
    return null;
  }

  const displayText =
    showFull || deviceDescription.length <= 300
      ? deviceDescription
      : `${deviceDescription.substring(0, 300)}...`;

  return (
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
            {displayText}
          </Text>
          {deviceDescription.length > 300 && (
            <Text
              color="brand.primary"
              marginTop="8px"
              cursor="pointer"
              textDecoration="underline"
              onClick={() => setShowFull(!showFull)}
            >
              {showFull ? "Show less" : "Show more"}
            </Text>
          )}
        </Box>
      </Box>
    </>
  );
};
