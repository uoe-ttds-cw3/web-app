import { Box, HStack, Text } from "@chakra-ui/react";
import Highlighter from "react-highlight-words";
import Link from "next/link";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";

export type TitleRowProps = {
  device: Device;
  searchQuery?: string;
};

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
};

const getRetrievalSourceConfig = (source: string) => {
  return (
    {
      keyword: { label: "keyword search" },
      semantic: { label: "semantic search" },
      both: { label: "keyword + semantic" },
    }[source] || { label: source }
  );
};

const MATCH_CONTEXT_TOOLTIPS: Record<string, string> = {
  keyword:
    "Found by keyword matching - your search terms appear in the device name or summary",
  semantic:
    "Found by semantic search - conceptually similar to your search meaning",
  both: "Found by both keyword and semantic search - strongest match type",
};

export const TitleRow = ({ device, searchQuery = "" }: TitleRowProps) => {
  const showSourceInfo = device.matchReason || device.retrievalSource;

  const retrievalConfig = device.retrievalSource
    ? getRetrievalSourceConfig(device.retrievalSource)
    : null;

  return (
    <HStack
      alignItems="flex-start"
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

      {showSourceInfo && (
        <HStack
          gap="1.5"
          flexWrap="wrap"
          alignItems="center"
          fontSize="xs"
          color="ui.textMuted"
          border="1px solid"
          borderColor="ui.borderLight"
          borderRadius="full"
          px="2"
          py="1"
          flexShrink={0}
          flexBasis={{ base: "100%", md: "auto" }}
          width={{ base: "100%", md: "auto" }}
        >
          <Text color="ui.textMuted">Matched by</Text>
          {device.matchReason && (
            <Tooltip
              content={device.matchDetail || device.matchReason}
              showArrow
              openDelay={200}
              contentProps={TOOLTIP_PROPS}
            >
              <Text
                cursor="help"
                color="ui.text"
                textDecoration="underline dotted"
                textUnderlineOffset="2px"
              >
                {device.matchReason}
              </Text>
            </Tooltip>
          )}
          {device.matchReason && retrievalConfig && (
            <Text color="ui.textMuted">·</Text>
          )}
          {retrievalConfig && device.retrievalSource && (
            <Tooltip
              content={
                MATCH_CONTEXT_TOOLTIPS[device.retrievalSource] ||
                "Search result"
              }
              showArrow
              openDelay={200}
              contentProps={TOOLTIP_PROPS}
            >
              <Text
                cursor="help"
                color="ui.text"
                textDecoration="underline dotted"
                textUnderlineOffset="2px"
              >
                {retrievalConfig.label}
              </Text>
            </Tooltip>
          )}
        </HStack>
      )}
    </HStack>
  );
};
