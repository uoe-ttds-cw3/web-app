import { Box, Heading, HStack, Skeleton, Text } from "@chakra-ui/react";
import type { SearchResultItem } from "@/lib/api/types";
import { formatDate } from "./utils";

export type RelatedDevicesSectionProps = {
  title: string;
  subtitle?: string;
  devices: SearchResultItem[];
  isLoading: boolean;
  showSponsor?: boolean;
  onDeviceClick: (device: SearchResultItem) => void;
};

type RelatedDeviceCardProps = {
  device: SearchResultItem;
  showSponsor: boolean;
  onClick: (device: SearchResultItem) => void;
};

const RelatedDeviceCard = ({
  device,
  showSponsor,
  onClick,
}: RelatedDeviceCardProps) => {
  return (
    <Box
      minWidth="220px"
      maxWidth="220px"
      height="170px"
      display="flex"
      flexDirection="column"
      padding="12px"
      borderWidth="1px"
      borderColor="ui.border"
      borderRadius="8px"
      cursor="pointer"
      _hover={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderColor: "brand.primary",
      }}
      onClick={() => onClick(device)}
    >
      <Text
        fontSize="sm"
        fontWeight="bold"
        color="brand.primary"
        marginBottom="8px"
        lineClamp={2}
        lineHeight="1.3"
        minHeight="36px"
      >
        {device.device_name}
      </Text>
      <Text fontSize="xs" color="ui.textMuted" marginBottom="4px">
        {device.submission_number}
      </Text>
      {showSponsor && (
        <Text fontSize="xs" color="ui.textMuted" marginBottom="4px">
          {device.sponsor}
        </Text>
      )}
      {device.decision_date && (
        <Text fontSize="xs" color="ui.textMuted">
          {formatDate(device.decision_date)}
        </Text>
      )}
    </Box>
  );
};

export const RelatedDevicesSection = ({
  title,
  subtitle,
  devices,
  isLoading,
  showSponsor = false,
  onDeviceClick,
}: RelatedDevicesSectionProps) => {
  if (!isLoading && devices.length === 0) {
    return null;
  }

  return (
    <Box>
      <Heading size="md" color="brand.primary" marginBottom="12px">
        {title}
      </Heading>
      {subtitle && (
        <Text fontSize="sm" color="ui.textMuted" marginBottom="8px">
          {subtitle}
        </Text>
      )}
      {isLoading ? (
        <HStack gap="3" overflowX="auto" paddingY="8px">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height="120px" minWidth="220px" borderRadius="8px" />
          ))}
        </HStack>
      ) : (
        <HStack gap="3" overflowX="auto" paddingY="8px">
          {devices.map((device) => (
            <RelatedDeviceCard
              key={device.submission_number}
              device={device}
              showSponsor={showSponsor}
              onClick={onDeviceClick}
            />
          ))}
        </HStack>
      )}
    </Box>
  );
};
