import { Box, HStack, Text } from "@chakra-ui/react";
import type { Device } from "@/lib/api/types";
import { ManufacturerSearchLink } from "./ManufacturerSearchLink";
import { ProductCodeValue } from "./ProductCodeValue";

export type MetadataRowProps = {
  device: Device;
};

export const MetadataRow = ({ device }: MetadataRowProps) => {
  const manufacturer = device.manufacturer;

  const metadataItems = [
    manufacturer ? (
      <Text key="manufacturer">
        Manufacturer: <ManufacturerSearchLink label={manufacturer} />
      </Text>
    ) : null,
    device.date ? (
      <Text key="date">
        Decision Date:{" "}
        <Box as="span" color="ui.text">
          {device.date}
        </Box>
      </Text>
    ) : null,
    device.panel ? (
      <Text key="panel">
        Panel:{" "}
        <Box as="span" color="ui.text">
          {device.panel}
        </Box>
      </Text>
    ) : null,
    device.pCode ? (
      <Text key="product-code">
        Product Code: <ProductCodeValue code={device.pCode} />
      </Text>
    ) : null,
    device.deviceClass ? (
      <Text key="class">
        Class:{" "}
        <Box as="span" color="ui.text">
          {device.deviceClass}
        </Box>
      </Text>
    ) : null,
  ].filter(Boolean);

  return (
    <Box fontSize={{ base: "xs", md: "sm" }} color="ui.textMuted">
      <HStack gap={{ base: "2", md: "3" }} flexWrap="wrap" alignItems="center">
        {metadataItems.map((item, index) => (
          <HStack key={index} gap={{ base: "0", md: "3" }} alignItems="center">
            {index > 0 && (
              <Text
                display={{ base: "none", md: "inline" }}
                color="ui.textMuted"
              >
                |
              </Text>
            )}
            {item}
          </HStack>
        ))}
      </HStack>
    </Box>
  );
};
