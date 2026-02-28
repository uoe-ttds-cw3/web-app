import { Box, HStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import type { Device } from "@/lib/api/types";

export type MetadataRowProps = {
  device: Device;
};

export const MetadataRow = ({ device }: MetadataRowProps) => {
  return (
    <Box fontSize={{ base: "xs", md: "sm" }} color="ui.textMuted" mb="3">
      <Box display={{ base: "flex", md: "none" }} flexDirection="column" gap="1">
        {device.manufacturer && (
          <Text>
            Manufacturer:{" "}
            <ChakraLink asChild color="brand.primary" textDecoration="underline">
              <Link href={{ pathname: "/", query: { q: device.manufacturer } }}>
                {device.manufacturer}
              </Link>
            </ChakraLink>
          </Text>
        )}
        {device.date && (
          <Text>
            Date:{" "}
            <Box as="span" color="ui.text">
              {device.date}
            </Box>
          </Text>
        )}
        <HStack gap="3" flexWrap="wrap">
          {device.panel && (
            <Text>
              Panel:{" "}
              <Box as="span" color="ui.text">
                {device.panel}
              </Box>
            </Text>
          )}
          {device.deviceClass && (
            <Text>
              Class:{" "}
              <Box as="span" color="ui.text">
                {device.deviceClass}
              </Box>
            </Text>
          )}
          {device.pCode && (
            <Text>
              Code:{" "}
              <Box as="span" color="ui.text">
                {device.pCode}
              </Box>
            </Text>
          )}
        </HStack>
      </Box>

      <HStack display={{ base: "none", md: "flex" }} gap="3" flexWrap="wrap">
        {device.sponsor && (
          <Text>
            Manufacturer:{" "}
            <ChakraLink asChild color="brand.primary" textDecoration="underline">
              <Link href={`/q=${device.sponsor}`}>{device.sponsor}</Link>
            </ChakraLink>
          </Text>
        )}
        {device.date && <Text>|</Text>}
        {device.date && (
          <Text>
            Date:{" "}
            <Box as="span" color="ui.text">
              {device.date}
            </Box>
          </Text>
        )}
        {device.panel && <Text>|</Text>}
        {device.panel && (
          <Text>
            Panel:{" "}
            <Box as="span" color="ui.text">
              {device.panel}
            </Box>
          </Text>
        )}
        {device.deviceClass && <Text>|</Text>}
        {device.deviceClass && (
          <Text>
            Class:{" "}
            <Box as="span" color="ui.text">
              {device.deviceClass}
            </Box>
          </Text>
        )}
        {device.pCode && <Text>|</Text>}
        {device.pCode && (
          <Text>
            Product Code:{" "}
            <Box as="span" color="ui.text">
              {device.pCode}
            </Box>
          </Text>
        )}
      </HStack>
    </Box>
  );
};
