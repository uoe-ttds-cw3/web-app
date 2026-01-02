import NextLink from "next/link";
import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/ColorMode";

export function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="10"
      bg="chakra-body-bg"
      borderBottom="1px solid"
      borderColor="gray.200"
      _dark={{ borderColor: "gray.700" }}
    >
      <Flex
        maxW="60ch"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        h="64px"
        align="center"
        justify="space-between"
      >
        <HStack>
          <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
            <Text fontWeight="semibold">Medical Device Search Engine</Text>
          </Link>
        </HStack>
        <ColorModeButton />
      </Flex>
    </Box>
  );
}
