import { Box, Heading, Text } from "@chakra-ui/react";

export type StandardsReferencedSectionProps = {
  standards: string[];
};

export const StandardsReferencedSection = ({
  standards,
}: StandardsReferencedSectionProps) => {
  if (standards.length === 0) {
    return null;
  }

  return (
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
  );
};
