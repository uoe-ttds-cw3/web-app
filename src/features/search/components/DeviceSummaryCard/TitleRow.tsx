import { Badge, Box, HStack } from "@chakra-ui/react";
import Highlighter from "react-highlight-words";
import Link from "next/link";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";

export type TitleRowProps = {
  device: Device;
  searchQuery?: string;
};

export const TitleRow = ({ device, searchQuery = "" }: TitleRowProps) => {
  const tooltipProps = {
    bg: "ui.background",
    color: "ui.text",
    px: 2,
    py: 1,
    borderRadius: "md",
  };

  return (
    <HStack
      alignItems="flex-start"
      marginBottom="3"
      flexWrap={{ base: "wrap", md: "nowrap" }}
      gap="2"
      width="100%"
    >
      <Box
        fontWeight="bold"
        fontSize={{ base: "md", md: "lg" }}
        color="brand.primary"
        _hover={{ textDecoration: "underline" }}
        display="block"
        flex="1"
        lineClamp={2}
        cursor="pointer"
      >
        <Link href={`/devices/${device.id}`}>
          {searchQuery ? (
            <Highlighter
              searchWords={searchQuery.split(/\s+/)}
              autoEscape
              textToHighlight={device.name}
              highlightStyle={{
                fontWeight: "bold",
                backgroundColor: "#FFEB3B80",
              }}
            />
          ) : (
            device.name
          )}
        </Link>
      </Box>
      {device.matchReason && (
        <Tooltip
          content={device.matchDetail || device.matchReason}
          showArrow
          openDelay={200}
          contentProps={tooltipProps}
        >
          <Badge
            variant="outline"
            colorPalette="blue"
            fontSize="xs"
            flexShrink={0}
            padding="0 0.25rem"
            cursor="help"
          >
            {device.matchReason}
          </Badge>
        </Tooltip>
      )}
      {device.retrievalSource && (
        <Badge
          variant="outline"
          colorPalette={
            device.retrievalSource === "keyword"
              ? "green"
              : device.retrievalSource === "semantic"
                ? "purple"
                : "teal"
          }
          fontSize="xs"
          flexShrink={0}
          padding="0 0.25rem"
        >
          {device.retrievalSource === "keyword"
            ? "keyword match"
            : device.retrievalSource === "semantic"
              ? "semantic match"
              : "keyword & semantic match"}
        </Badge>
      )}
      {device.adverseEvents != null && device.adverseEvents > 0 && (
        <Tooltip
          content={`${device.adverseEvents.toLocaleString()} reported adverse events for this device (FDA MAUDE)`}
          showArrow
          openDelay={200}
          contentProps={tooltipProps}
        >
          <Badge
            colorPalette={device.adverseEvents >= 100 ? "red" : "orange"}
            variant="solid"
            fontSize="xs"
            flexShrink={0}
            padding="0 0.25rem"
            cursor="help"
          >
            {device.adverseEvents.toLocaleString()} Adverse Events
          </Badge>
        </Tooltip>
      )}
    </HStack>
  );
};
