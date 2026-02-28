import { Box, HStack, Icon, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";

export type MetadataRowProps = {
  device: Device;
};

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
};

type ManufacturerSearchLinkProps = {
  label: string;
};

const ManufacturerSearchLink = ({ label }: ManufacturerSearchLinkProps) => {
  return (
    <Tooltip
      content="Search for more devices from this manufacturer"
      showArrow
      openDelay={200}
      contentProps={TOOLTIP_PROPS}
    >
      <ChakraLink
        asChild
        color="brand.primary"
        textDecoration="underline"
        textUnderlineOffset="2px"
      >
        <Link href={{ pathname: "/", query: { q: label } }}>
          {label} <Icon as={LuSearch} boxSize="3" verticalAlign="middle" />
        </Link>
      </ChakraLink>
    </Tooltip>
  );
};

export const MetadataRow = ({ device }: MetadataRowProps) => {
  return (
    <Box fontSize={{ base: "xs", md: "sm" }} color="ui.textMuted">
      <Box
        display={{ base: "flex", md: "none" }}
        flexDirection="column"
        gap="1"
      >
        {device.manufacturer && (
          <Text>
            Manufacturer:{" "}
            <ManufacturerSearchLink label={device.manufacturer} />
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
            <ManufacturerSearchLink label={device.sponsor} />
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
