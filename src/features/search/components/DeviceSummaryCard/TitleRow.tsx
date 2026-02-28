import { Badge, Box, HStack } from "@chakra-ui/react";
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

const MATCH_REASON_COLORS: Record<string, string> = {
  "exact submission number": "green",
  "device name match": "blue",
  "manufacturer match": "blue",
  "product code match": "blue",
  "matched in summary": "gray",
  "related device": "gray",
};

const RETRIEVAL_SOURCE_CONFIG: Record<
  string,
  { color: string; label: string }
> = {
  keyword: { color: "green", label: "keyword match" },
  semantic: { color: "purple", label: "semantic match" },
  both: { color: "teal", label: "keyword & semantic match" },
};

const getMatchReasonColor = (reason: string): string => {
  return MATCH_REASON_COLORS[reason] || "gray";
};

const getRetrievalSourceConfig = (source: string) => {
  return RETRIEVAL_SOURCE_CONFIG[source] || { color: "gray", label: source };
};

const MatchReasonBadge = ({ device }: { device: Device }) => {
  if (!device.matchReason) return null;

  return (
    <Tooltip
      content={device.matchDetail || device.matchReason}
      showArrow
      openDelay={200}
      contentProps={TOOLTIP_PROPS}
    >
      <Badge
        variant="outline"
        colorPalette={getMatchReasonColor(device.matchReason)}
        fontSize="xs"
        flexShrink={0}
        cursor="help"
        padding="0 0.25rem"
      >
        {device.matchReason}
      </Badge>
    </Tooltip>
  );
};

const RetrievalSourceBadge = ({ device }: { device: Device }) => {
  if (!device.retrievalSource) return null;

  const config = getRetrievalSourceConfig(device.retrievalSource);

  const tooltipContent =
    {
      keyword:
        "Found by keyword matching - your search terms appear in the device name or summary",
      semantic:
        "Found by semantic search - conceptually similar to your search meaning",
      both: "Found by both keyword and semantic search - strongest match type",
    }[device.retrievalSource] || "Search result";

  return (
    <Tooltip
      content={tooltipContent}
      showArrow
      openDelay={200}
      contentProps={TOOLTIP_PROPS}
    >
      <Badge
        variant="outline"
        colorPalette={config.color}
        fontSize="xs"
        flexShrink={0}
        cursor="help"
        padding="0 0.25rem"
      >
        {config.label}
      </Badge>
    </Tooltip>
  );
};

export const TitleRow = ({ device, searchQuery = "" }: TitleRowProps) => {
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

      {/* Badges */}
      <MatchReasonBadge device={device} />
      <RetrievalSourceBadge device={device} />
    </HStack>
  );
};
