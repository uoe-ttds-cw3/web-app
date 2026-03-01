import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import { ManufacturerSearchLink } from "@/features/search/components/DeviceSummaryCard/MetadataRow/ManufacturerSearchLink";
import { ProductCodeValue } from "@/features/search/components/DeviceShared/ProductCodeValue";
import type { DeviceLookupResponse } from "@/lib/api/types";

export type DeviceMetadataProps = {
  device: DeviceLookupResponse;
  formatDate: (isoDate: string | null) => string;
};

export const DeviceMetadata = ({ device, formatDate }: DeviceMetadataProps) => {
  return (
    <Box marginBottom="24px">
      <Heading size="md" color="brand.primary" marginBottom="12px">
        Device Information
      </Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="12px">
        <Box>
          <Text color="brand.primary" fontWeight="bold">
            Manufacturer:
          </Text>
          {device.sponsor ? (
            <ManufacturerSearchLink label={device.sponsor} />
          ) : (
            <Text color="black">N/A</Text>
          )}
        </Box>
        <Box>
          <Text color="brand.primary" fontWeight="bold">
            Decision Date:
          </Text>
          <Text color="black">{formatDate(device.decision_date)}</Text>
        </Box>
        <Box>
          <Text color="brand.primary" fontWeight="bold">
            Panel:
          </Text>
          <Text color="black">{device.panel || "N/A"}</Text>
        </Box>
        <Box>
          <Text color="brand.primary" fontWeight="bold">
            Product Code:
          </Text>
          {device.product_code ? (
            <ProductCodeValue code={device.product_code} color="black" />
          ) : (
            <Text color="black">N/A</Text>
          )}
        </Box>
        {device.device_class && (
          <Box>
            <Text color="brand.primary" fontWeight="bold">
              Class:
            </Text>
            <Text color="black">{device.device_class}</Text>
          </Box>
        )}
        <Box>
          <Text color="brand.primary" fontWeight="bold">
            Decision:
          </Text>
          <Text color="black">{device.decision || "N/A"}</Text>
        </Box>
        {device.date_received && (
          <Box>
            <Text color="brand.primary" fontWeight="bold">
              Date Received:
            </Text>
            <Text color="black">{formatDate(device.date_received)}</Text>
          </Box>
        )}
      </Grid>
    </Box>
  );
};
