import { Box, Badge, Heading, HStack } from "@chakra-ui/react";

export type SterilizationMethodsSectionProps = {
  methods: string[];
};

export const SterilizationMethodsSection = ({
  methods,
}: SterilizationMethodsSectionProps) => {
  if (methods.length === 0) {
    return null;
  }

  return (
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
  );
};
