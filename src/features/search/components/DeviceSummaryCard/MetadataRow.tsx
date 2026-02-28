import { Box, HStack, Icon, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import { PRODUCT_CODES } from "@/data/PRODUCT_CODES";
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

type ProductCodeValueProps = {
  code: string;
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

const ProductCodeValue = ({ code }: ProductCodeValueProps) => {
  const productCode =
    PRODUCT_CODES[code.toUpperCase() as keyof typeof PRODUCT_CODES];

  if (!productCode) {
    return (
      <Box as="span" color="ui.text">
        {code}
      </Box>
    );
  }

  return (
    <Tooltip
      content={<Box fontWeight="semibold">{productCode.name}</Box>}
      showArrow
      openDelay={200}
      contentProps={TOOLTIP_PROPS}
    >
      <Box
        as="span"
        color="ui.text"
        cursor="help"
        textDecoration="underline dotted"
        textUnderlineOffset="2px"
      >
        {code}
      </Box>
    </Tooltip>
  );
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
