import {
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import type { Device } from "@/lib/api/types";

export type ActionFooterProps = {
  device: Device;
  isSelected: boolean;
  onToggle: (device: Device) => void;
};

export const ActionFooter = ({
  device,
  isSelected,
  onToggle,
}: ActionFooterProps) => {
  return (
    <Box>
      <Grid
        templateColumns={{ base: "1fr", md: "minmax(0, 1fr) auto" }}
        gap={{ base: 3, md: 4 }}
        p={{ base: 2, md: 2 }}
        alignItems="center"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        <GridItem
          justifySelf={{ base: "center", md: "start" }}
          display="flex"
          alignItems="center"
        >
          <Checkbox.Root
            cursor="pointer"
            checked={isSelected}
            onCheckedChange={() => onToggle(device)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Add to comparison</Checkbox.Label>
          </Checkbox.Root>
        </GridItem>

        <GridItem
          justifySelf={{ base: "center", md: "end" }}
          width="100%"
          display="flex"
          alignItems="center"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: "2", md: "5" }}
            align={{ base: "center", md: "center" }}
            justify={{ base: "center", md: "flex-end" }}
            wrap={{ base: "nowrap", md: "wrap" }}
            width="100%"
          >
            <ChakraLink
              asChild
              color="brand.primary"
              fontSize="xs"
              fontWeight="semibold"
              px="3"
              py="1.5"
              borderRadius="full"
              border="1px solid"
              borderColor="brand.primary"
              textDecoration="none"
              _hover={{
                textDecoration: "none",
                backgroundColor: "rgba(30, 90, 168, 0.08)",
              }}
            >
              <Link href={`/devices/${device.id}`}>
                View Full Device Record &rarr;
              </Link>
            </ChakraLink>
            {device.id && (
              <ChakraLink
                href={`https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${device.id}`}
                target="_blank"
                rel="noopener noreferrer"
                color="brand.primary"
                fontSize="xs"
                textDecoration="underline"
                _hover={{ opacity: 0.8 }}
              >
                View on FDA ↗
              </ChakraLink>
            )}
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
};
