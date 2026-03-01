import { Box, Badge, Heading, HStack, Separator } from "@chakra-ui/react";
import type { DeviceLookupResponse } from "@/lib/api/types";

export type SterilizationMethodsSectionProps = {
  device: DeviceLookupResponse;
};

export const SterilizationMethodsSection = ({
  device,
}: SterilizationMethodsSectionProps) => {
  const methods = device.sterilization_methods;

  if (methods.length === 0) {
    return null;
  }

  return (
    <>
      <Separator marginY="16px" />
      <Box marginBottom="24px">
        <Heading size="md" color="brand.primary" marginBottom="12px">
          Sterilization Methods
        </Heading>
        <HStack gap="2" flexWrap="wrap">
          {methods.map((method) => (
            <Badge
              key={method}
              variant="subtle"
              colorPalette="gray"
              padding="4px 8px"
            >
              {method}
            </Badge>
          ))}
        </HStack>
      </Box>
    </>
  );
};
