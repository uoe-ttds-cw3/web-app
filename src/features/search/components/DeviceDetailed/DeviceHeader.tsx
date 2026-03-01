import {
  Badge,
  Box,
  Heading,
  Icon,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import posthog from "posthog-js";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import type { DeviceLookupResponse, DeviceSafetyData } from "@/lib/api/types";

export type DeviceHeaderProps = {
  device: DeviceLookupResponse;
  deviceSafety: DeviceSafetyData | null;
};

export const DeviceHeader = ({
  device,
  deviceSafety,
}: DeviceHeaderProps) => {
  let yearpart = "";

  if (device.date_received) {
    const year = parseInt(device.date_received.slice(0, 4), 10);

    if (year >= 2002) {
      yearpart = device.date_received.slice(2, 4).replace(/^0/, "");
    }
  }

  const tooltipProps = {
    bg: "ui.background",
    color: "ui.text",
    px: 2,
    py: 1,
    borderRadius: "md",
    border: "1px solid",
    borderColor: "ui.borderLight",
    boxShadow: "md",
    maxW: "320px",
  };

  return (
    <Box marginBottom="24px">
      <Heading
        size={{ base: "lg", md: "xl" }}
        color="brand.primary"
        marginBottom="8px"
      >
        {device.device_name}
      </Heading>
      <Box
        display="flex"
        alignItems="center"
        gap="6px"
        marginBottom="8px"
        flexWrap="wrap"
      >
        <Text fontSize="sm" color="ui.textMuted" fontWeight="medium">
          Submission number
        </Text>
        <Tooltip
          content="The FDA submission number is the unique identifier assigned to this device submission."
          showArrow
          openDelay={200}
          contentProps={tooltipProps}
        >
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            color="ui.textMuted"
            cursor="help"
          >
            <Icon as={LuInfo} boxSize="3.5" />
          </Box>
        </Tooltip>
        <Badge
          colorScheme="gray"
          fontSize="md"
          padding="4px 8px"
          userSelect="text"
        >
          {device.submission_number}
        </Badge>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap="8px"
        marginBottom="8px"
        flexWrap="wrap"
      >
        {device.date_received && (
          <ChakraLink
            href={`https://www.accessdata.fda.gov/cdrh_docs/pdf${yearpart}/${device.submission_number}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            color="brand.primary"
            fontSize="sm"
            textDecoration="underline"
            onClick={() => {
              posthog.capture("fda_document_link_clicked", {
                device_id: device.submission_number,
                device_name: device.device_name,
                product_code: device.product_code,
              });
            }}
          >
            View FDA document ↗
          </ChakraLink>
        )}
        <ChakraLink
          href={`https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${device.submission_number}`}
          target="_blank"
          rel="noopener noreferrer"
          color="brand.primary"
          fontSize="sm"
          textDecoration="underline"
        >
          View on FDA ↗
        </ChakraLink>
      </Box>
      {deviceSafety?.brand_names && deviceSafety.brand_names.length > 0 && (
        <Box marginTop="8px">
          <Text fontSize="sm" color="ui.textMuted" display="inline">
            Also known as:{" "}
          </Text>
          <Text
            fontSize="sm"
            color="black"
            display="inline"
            fontWeight="medium"
          >
            {deviceSafety.brand_names.join(", ")}
          </Text>
        </Box>
      )}
    </Box>
  );
};
