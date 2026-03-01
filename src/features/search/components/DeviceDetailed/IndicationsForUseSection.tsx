import { Box, Heading, Separator, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { DeviceLookupResponse } from "@/lib/api/types";

export type IndicationsForUseSectionProps = {
  device: DeviceLookupResponse;
};

export const IndicationsForUseSection = ({ device }: IndicationsForUseSectionProps) => {
  const [showFull, setShowFull] = useState(false);
  const indicationsForUse = device.indications_for_use;

  if (!indicationsForUse) {
    return null;
  }

  const displayText =
    showFull || indicationsForUse.length <= 300
      ? indicationsForUse
      : `${indicationsForUse.substring(0, 300)}...`;

  return (
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
            {displayText}
          </Text>
          {indicationsForUse.length > 300 && (
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
