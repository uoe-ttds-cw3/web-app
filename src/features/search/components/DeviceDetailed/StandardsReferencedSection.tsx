import { Box, Heading, Separator, Text } from "@chakra-ui/react";
import type { DeviceLookupResponse } from "@/lib/api/types";

export type StandardsReferencedSectionProps = {
  device: DeviceLookupResponse;
};

export const StandardsReferencedSection = ({
  device,
}: StandardsReferencedSectionProps) => {
  const standards = device.standards_referenced;

  if (standards.length === 0) {
    return null;
  }

  return (
    <>
      <Separator marginY="16px" />
      <Box marginBottom="24px">
        <Heading size="md" color="brand.primary" marginBottom="12px">
          Standards Referenced
        </Heading>
        <Box>
          {standards.map((standard) => (
            <Text key={standard} fontSize="sm" color="black" marginBottom="4px">
              {standard}
            </Text>
          ))}
        </Box>
      </Box>
    </>
  );
};
