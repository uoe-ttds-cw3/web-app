import { Box, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import Link from "next/link";

export type Device = {
  id: string;           // submission_number
  name: string;         // device_name
  manufacturer: string; // sponsor
  date: string;         // decision_date
  panel: string;        // panel name
  pCode: string;        // product_code
  recalls: number;      // default 0 (populated later by safety data)
  availability: boolean; // default true
  snippet: string;      // search result snippet
  relevanceScore: number;
  deviceClass: string | null;
  pagerankScore: number | null;
};

type DeviceSummaryCardProps = {
  device: Device;
  searchQuery?: string;
};

// helper to get recall count color based on wcag-compliant semantic tokens
const getRecallColor = (count: number): string => {
  if (count === 0) return "status.safe";
  if (count >= 1 && count <= 5) return "status.warning";
  return "status.danger"; // 6+
};

export const DeviceSummaryCard = ({
  device: { id, name, manufacturer, date, panel, pCode, recalls, deviceClass, snippet },
  searchQuery = "",
}: DeviceSummaryCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // truncate snippet to ~200 chars
  const shouldTruncate = snippet && snippet.length > 200;
  const displaySnippet = shouldTruncate && !expanded
    ? snippet.slice(0, 200)
    : snippet;

  return (
    <Box
      backgroundColor="ui.surface"
      padding="4"
      borderRadius="12px"
      border="1px solid"
      borderColor="ui.borderLight"
      marginBottom="4"
    >
      {/* title as clickable link */}
      <Link href={`/devices/${id}`} passHref legacyBehavior>
        <Box
          as="a"
          fontWeight="bold"
          fontSize="lg"
          color="brand.primary"
          _hover={{ textDecoration: "underline" }}
          display="block"
          marginBottom="2"
        >
          {searchQuery ? (
            <Highlighter
              searchWords={searchQuery.split(/\s+/)}
              autoEscape={true}
              textToHighlight={name}
              highlightStyle={{ fontWeight: "bold", backgroundColor: "#FFEB3B80" }}
            />
          ) : (
            name
          )}
        </Box>
      </Link>

      {/* compact metadata in horizontal layout */}
      <HStack
        fontSize="sm"
        color="ui.textMuted"
        gap="3"
        flexWrap="wrap"
        marginBottom="2"
      >
        {manufacturer && (
          <Text>
            Manufacturer: <Box as="span" color="ui.text">{manufacturer}</Box>
          </Text>
        )}
        {date && (
          <Text>|</Text>
        )}
        {date && (
          <Text>
            Date: <Box as="span" color="ui.text">{date}</Box>
          </Text>
        )}
        {panel && (
          <Text>|</Text>
        )}
        {panel && (
          <Text>
            Panel: <Box as="span" color="ui.text">{panel}</Box>
          </Text>
        )}
        {deviceClass && (
          <Text>|</Text>
        )}
        {deviceClass && (
          <Text>
            Class: <Box as="span" color="ui.text">{deviceClass}</Box>
          </Text>
        )}
        {pCode && (
          <Text>|</Text>
        )}
        {pCode && (
          <Text>
            Product Code: <Box as="span" color="ui.text">{pCode}</Box>
          </Text>
        )}
      </HStack>

      {/* recall count with color coding */}
      <Text fontSize="sm" color={getRecallColor(recalls)} marginBottom="2">
        Number of recalls: {recalls}
      </Text>

      {/* snippet with search highlighting and read more */}
      {snippet && (
        <Box fontSize="sm" color="ui.textMuted">
          {searchQuery ? (
            <Highlighter
              searchWords={searchQuery.split(/\s+/)}
              autoEscape={true}
              textToHighlight={displaySnippet}
              highlightStyle={{ fontWeight: "bold", backgroundColor: "#FFEB3B80" }}
            />
          ) : (
            <Text>{displaySnippet}</Text>
          )}
          {shouldTruncate && !expanded && (
            <>
              ...{" "}
              <Box
                as="span"
                color="brand.primary"
                cursor="pointer"
                textDecoration="underline"
                onClick={() => setExpanded(true)}
              >
                read more
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};
