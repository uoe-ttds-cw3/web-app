import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import { FullBleed } from "@/components/ui/FullBleed";

export default function Home() {
  return (
    <>
      <Stack spaceY={6}>
        <Heading>Centered content</Heading>
        <Text>This content is constrained to a readable max-width.</Text>
        <FullBleed>
          <Box py={{ base: 14, md: 20 }}>
            <Box maxW="60ch" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
              <Heading size="lg">Full-bleed section</Heading>
              <Text mt={3} opacity={0.9}>
                The background spans edge-to-edge, while the text stays aligned
                with the normal column.
              </Text>
            </Box>
          </Box>
        </FullBleed>

        <Text>Back to centered content after the full-bleed section.</Text>
      </Stack>
    </>
  );
}
