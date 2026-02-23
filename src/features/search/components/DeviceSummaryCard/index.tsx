import { Box, HStack, Text, Checkbox, Badge } from "@chakra-ui/react";
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
  materials: string[];
  indicationsForUse: string | null;
  hasClinicalData: boolean;
  hasSterilization: boolean;
  hasBiocompatibility: boolean;
  hasSoftware: boolean;
  hasElectricalSafety: boolean;
};

type DeviceSummaryCardProps = {
  device: Device;
  searchQuery?: string;
  selectedDevices: Device[];
  onToggle: (device: Device) => void;
};

export const DeviceSummaryCard = ({
  device,
  selectedDevices,
  onToggle,
  searchQuery = "",
}: DeviceSummaryCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const isSelected = selectedDevices.some((d) => d.id === device.id);

  const shouldTruncate = device.snippet && device.snippet.length > 200;

  const displaySnippet =
    shouldTruncate && !expanded ? device.snippet.slice(0, 200) : device.snippet;

  return (
    <Box
      backgroundColor="ui.surface"
      padding="4"
      borderRadius="12px"
      border="1px solid"
      borderColor="ui.borderLight"
      marginBottom="4"
    >
      <Box
        fontWeight="bold"
        fontSize="lg"
        color="brand.primary"
        _hover={{ textDecoration: "underline" }}
        display="block"
        marginBottom="2"
      >
        <Link href={`/devices/${device.id}`} legacyBehavior>
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

      <HStack fontSize="sm" color="ui.textMuted" gap="3" flexWrap="wrap" mb="2">
        {device.manufacturer && (
          <Text>
            Manufacturer:{" "}
            <Box as="span" color="ui.text">
              {device.manufacturer}
            </Box>
          </Text>
        )}

        {device.date && <Text>|</Text>}
        {device.date && (
          <Text>
            Date:{" "}
            <Box as="span" color="ui.text">
              {device.date}
            </Box>
          </Text>
        )}

        {device.panel && <Text>|</Text>}
        {device.panel && (
          <Text>
            Panel:{" "}
            <Box as="span" color="ui.text">
              {device.panel}
            </Box>
          </Text>
        )}

        {device.deviceClass && <Text>|</Text>}
        {device.deviceClass && (
          <Text>
            Class:{" "}
            <Box as="span" color="ui.text">
              {device.deviceClass}
            </Box>
          </Text>
        )}

        {device.pCode && <Text>|</Text>}
        {device.pCode && (
          <Text>
            Product Code:{" "}
            <Box as="span" color="ui.text">
              {device.pCode}
            </Box>
          </Text>
        )}
      </HStack>

      {/* feature badges - only show flags that are true */}
      {(device.hasClinicalData ||
        device.hasSterilization ||
        device.hasBiocompatibility ||
        device.hasSoftware ||
        device.hasElectricalSafety) && (
        <HStack gap="2" flexWrap="wrap" mb="2">
          {device.hasClinicalData && (
            <Badge variant="subtle" colorPalette="gray" fontSize="xs">
              clinical data
            </Badge>
          )}
          {device.hasSterilization && (
            <Badge variant="subtle" colorPalette="gray" fontSize="xs">
              sterilization
            </Badge>
          )}
          {device.hasBiocompatibility && (
            <Badge variant="subtle" colorPalette="gray" fontSize="xs">
              biocompatibility
            </Badge>
          )}
          {device.hasSoftware && (
            <Badge variant="subtle" colorPalette="gray" fontSize="xs">
              software
            </Badge>
          )}
          {device.hasElectricalSafety && (
            <Badge variant="subtle" colorPalette="gray" fontSize="xs">
              electrical safety
            </Badge>
          )}
        </HStack>
      )}

      {/* materials */}
      {device.materials.length > 0 && (
        <Text fontSize="sm" color="ui.textMuted" mb="2">
          {device.materials.join(" · ")}
        </Text>
      )}

      <Link href={`/devices/${device.id}`} legacyBehavior>
        <Box
          as="a"
          fontSize="sm"
          color="brand.primary"
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
          mb="2"
          display="block"
        >
          view safety data &rarr;
        </Box>
      </Link>

      {device.snippet && (
        <Box fontSize="sm" color="ui.textMuted">
          {searchQuery ? (
            <Highlighter
              searchWords={searchQuery.split(/\s+/)}
              autoEscape
              textToHighlight={displaySnippet}
              highlightStyle={{
                fontWeight: "bold",
                backgroundColor: "#FFEB3B80",
              }}
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
