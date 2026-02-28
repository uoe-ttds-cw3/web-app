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
        templateColumns="repeat(2, 1fr)"
        gap={4}
        p={4}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        <GridItem justifySelf="start">
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

        <GridItem justifySelf="end">
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: "2", md: "5" }}
            align={{ base: "flex-end", md: "center" }}
            justify={{ base: "flex-end", md: "flex-end" }}
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
                backgroundColor: "rgba(47, 94, 47, 0.08)",
              }}
            >
              <Link href={`/devices/${device.id}`}>View Full Device Record &rarr;</Link>
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
