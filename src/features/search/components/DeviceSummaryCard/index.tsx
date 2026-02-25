import { Box, HStack, Text, Checkbox, Badge, Link as ChakraLink } from "@chakra-ui/react";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import Link from "next/link";
import { useRouter } from "next/router";
import { ExternalLinkIcon } from "@chakra-ui/icons";

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
  const router = useRouter();

  const isSelected = selectedDevices.some((d) => d.id === device.id);

  const shouldTruncate = device.snippet && device.snippet.length > 200;

  const displaySnippet =
    shouldTruncate && !expanded ? device.snippet.slice(0, 200) : device.snippet;

  return (
    <Box
      backgroundColor="ui.surface"
      padding={{ base: "3", md: "4" }}
      borderRadius="12px"
      border="1px solid"
      borderColor="ui.borderLight"
      marginBottom="3"
    >
      <HStack alignItems="center" marginBottom="2">
        <Box
          fontWeight="bold"
          fontSize="lg"
          color="brand.primary"
          _hover={{ textDecoration: "underline" }}
          display="block"
          flex="1"
          lineClamp={2}
          cursor="pointer"
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
        {/* recall badge - renders when recall count available in search results */}
        {device.recalls !== undefined && device.recalls > 0 && (
          <Badge
            colorPalette={device.recalls >= 4 ? "red" : "yellow"}
            variant="solid"
            fontSize="xs"
          >
            {device.recalls} recall{device.recalls !== 1 ? "s" : ""}
          </Badge>
        )}
      </HStack>

      <HStack fontSize={{ base: "xs", md: "sm" }} color="ui.textMuted" gap={{ base: "2", md: "3" }} flexWrap="wrap" mb="2">
        {device.manufacturer && (
          <Text>
            Manufacturer:{" "}
            <Box
              as="span"
              color="brand.primary"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={() => router.push({ pathname: "/", query: { q: device.manufacturer } })}
            >
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

        {/* fda 510(k) link */}
        {device.id && (
          <>
            <Text>|</Text>
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
          </>
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
          View safety data &rarr;
        </Box>
      </Link>

      {device.snippet && (
        <Box
          fontSize="sm"
          color="ui.textMuted"
          userSelect="text"
          cursor="text"
          onDoubleClick={(e) => {
            // re-search selected text on double-click
            const selection = window.getSelection()?.toString().trim();
            if (selection && selection.length >= 3) {
              e.preventDefault();
              router.push({ pathname: "/", query: { q: selection } });
            }
          }}
        >
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
                Read more
              </Box>
            </>
          )}
        </Box>
      )}

      <Box mt="4">
        <Checkbox.Root
          cursor="pointer"
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
