import { Box, HStack, Text, Checkbox } from "@chakra-ui/react";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import Link from "next/link";

export type Device = {
  id: string;
  name: string;
  manufacturer: string;
  date: string;
  panel: string;
  pCode: string;
  recalls: number;
  availability: boolean;
  snippet: string;
  relevanceScore: number;
  deviceClass: string | null;
  pagerankScore: number | null;
};

type DeviceSummaryCardProps = {
  device: Device;
  searchQuery?: string;
  selectedDevices: Device[];
  onToggle: (device: Device) => void;
};

const getRecallColor = (count: number): string => {
  if (count === 0) return "status.safe";
  if (count <= 5) return "status.warning";
  return "status.danger";
};

export const DeviceSummaryCard = ({
  device,
  selectedDevices,
  onToggle,
  searchQuery = "",
}: DeviceSummaryCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const isSelected = selectedDevices.some(d => d.id === device.id);

  const shouldTruncate = device.snippet && device.snippet.length > 200;

  const displaySnippet =
    shouldTruncate && !expanded
      ? device.snippet.slice(0, 200)
      : device.snippet;

  return (
    <Box
      backgroundColor="ui.surface"
      padding="4"
      borderRadius="12px"
      border="1px solid"
      borderColor="ui.borderLight"
      marginBottom="4"
    >
      <Link href={`/devices/${device.id}`} legacyBehavior>
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
              autoEscape
              textToHighlight={device.name}
              highlightStyle={{ fontWeight: "bold", backgroundColor: "#FFEB3B80" }}
            />
          ) : (
            device.name
          )}
        </Box>
      </Link>

      <HStack fontSize="sm" color="ui.textMuted" gap="3" flexWrap="wrap" mb="2">
        {device.manufacturer && (
          <Text>
            Manufacturer: <Box as="span" color="ui.text">{device.manufacturer}</Box>
          </Text>
        )}

        {device.date && <Text>|</Text>}
        {device.date && (
          <Text>
            Date: <Box as="span" color="ui.text">{device.date}</Box>
          </Text>
        )}

        {device.panel && <Text>|</Text>}
        {device.panel && (
          <Text>
            Panel: <Box as="span" color="ui.text">{device.panel}</Box>
          </Text>
        )}

        {device.deviceClass && <Text>|</Text>}
        {device.deviceClass && (
          <Text>
            Class: <Box as="span" color="ui.text">{device.deviceClass}</Box>
          </Text>
        )}

        {device.pCode && <Text>|</Text>}
        {device.pCode && (
          <Text>
            Product Code: <Box as="span" color="ui.text">{device.pCode}</Box>
          </Text>
        )}
      </HStack>

      <Text fontSize="sm" color={getRecallColor(device.recalls)} mb="2">
        Number of recalls: {device.recalls}
      </Text>

      {device.snippet && (
        <Box fontSize="sm" color="ui.textMuted">
          {searchQuery ? (
            <Highlighter
              searchWords={searchQuery.split(/\s+/)}
              autoEscape
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

      <Box mt="4">
        <Checkbox.Root
          checked={isSelected}
          onCheckedChange={() => onToggle(device)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Add to comparison</Checkbox.Label>
        </Checkbox.Root>
      </Box>
    </Box>
  );
};
