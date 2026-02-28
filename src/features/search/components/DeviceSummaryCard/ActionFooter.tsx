import {
  Box,
  Checkbox,
  Grid,
  GridItem,
  Link as ChakraLink,
} from "@chakra-ui/react";
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
    <Box mt="4">
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
        </GridItem>
      </Grid>
    </Box>
  );
};
