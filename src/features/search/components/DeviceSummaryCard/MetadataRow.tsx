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
      content={
        <>
          <Box fontWeight="semibold">{productCode.name}</Box>
          <Box>
            Specialty: {productCode.specialty} | Class: {productCode.class}
          </Box>
        </>
      }
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
  return (
    <Box fontSize={{ base: "xs", md: "sm" }} color="ui.textMuted">
      <Box
        display={{ base: "flex", md: "none" }}
        flexDirection="column"
        gap="1"
      >
        {device.manufacturer && (
          <Text>
            Manufacturer: <ManufacturerSearchLink label={device.manufacturer} />
          </Text>
        )}
        {device.date && (
          <Text>
            Decision Date:{" "}
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
              Code: <ProductCodeValue code={device.pCode} />
            </Text>
          )}
        </HStack>
      </Box>

      <HStack display={{ base: "none", md: "flex" }} gap="3" flexWrap="wrap">
        {device.sponsor && (
          <Text>
            Manufacturer: <ManufacturerSearchLink label={device.sponsor} />
          </Text>
        )}
        {device.date && <Text>|</Text>}
        {device.date && (
          <Text>
            Decision Date:{" "}
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
            Product Code: <ProductCodeValue code={device.pCode} />
          </Text>
        )}
      </HStack>
    </Box>
  );
};
