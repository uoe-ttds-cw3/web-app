import { Box, HStack, Text, Checkbox, Badge, Link as ChakraLink } from "@chakra-ui/react";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import Link from "next/link";
import { useRouter } from "next/router";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";
export type { Device };

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
      padding={{ base: "4", md: "5" }}
      borderRadius="12px"
      border="1px solid"
      borderColor="ui.borderLight"
      marginBottom={{ base: "3", md: "4" }}
    >
      <HStack alignItems="flex-start" marginBottom="3">
        <Box
          fontWeight="bold"
          fontSize={{ base: "md", md: "lg" }}
          color="brand.primary"
          _hover={{ textDecoration: "underline" }}
          display="block"
          flex="1"
          lineClamp={{ base: 3, md: 2 }}
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
        {/* match reason badge - tells user why this result matched */}
        {device.matchReason && (
          <Tooltip
            content={device.matchDetail || device.matchReason}
            showArrow
            openDelay={200}
          >
            <Badge variant="outline" colorPalette="blue" fontSize="xs" flexShrink={0} cursor="help">
              {device.matchReason}
            </Badge>
          </Tooltip>
        )}
        {/* retrieval source badge - shows whether result came from keyword, semantic, or both */}
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
          >
            {device.retrievalSource === "keyword"
              ? "keyword match"
              : device.retrievalSource === "semantic"
                ? "semantic match"
                : "keyword + semantic"}
          </Badge>
        )}
        {/* recall badge - renders when recall count available in search results */}
        {device.recalls !== undefined && device.recalls > 0 && (
          <Badge
            colorPalette={device.recalls >= 4 ? "red" : "yellow"}
            variant="solid"
            fontSize="xs"
            flexShrink={0}
          >
            {device.recalls} recall{device.recalls !== 1 ? "s" : ""}
          </Badge>
        )}
        {/* adverse event badge - shows count from maude database */}
        {device.adverseEvents != null && device.adverseEvents > 0 && (
          <Tooltip
            content="reported adverse events from FDA MAUDE database for devices with this product code"
            showArrow
            openDelay={200}
          >
            <Badge
              colorPalette={device.adverseEvents >= 100 ? "red" : "orange"}
              variant="solid"
              fontSize="xs"
              flexShrink={0}
              cursor="help"
            >
              {device.adverseEvents} adverse event{device.adverseEvents !== 1 ? "s" : ""}
            </Badge>
          </Tooltip>
        )}
      </HStack>

      <Box fontSize={{ base: "xs", md: "sm" }} color="ui.textMuted" mb="3">
        {/* stacked on mobile, inline with pipes on desktop */}
        <Box display={{ base: "flex", md: "none" }} flexDirection="column" gap="1">
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
          {device.date && (
            <Text>Date: <Box as="span" color="ui.text">{device.date}</Box></Text>
          )}
          <HStack gap="3" flexWrap="wrap">
            {device.panel && (
              <Text>Panel: <Box as="span" color="ui.text">{device.panel}</Box></Text>
            )}
            {device.deviceClass && (
              <Text>Class: <Box as="span" color="ui.text">{device.deviceClass}</Box></Text>
            )}
            {device.pCode && (
              <Text>Code: <Box as="span" color="ui.text">{device.pCode}</Box></Text>
            )}
          </HStack>
          {device.id && (
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
          )}
        </Box>

        {/* desktop: inline with pipe separators */}
        <HStack display={{ base: "none", md: "flex" }} gap="3" flexWrap="wrap">
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
            <Text>Date: <Box as="span" color="ui.text">{device.date}</Box></Text>
          )}
          {device.panel && <Text>|</Text>}
          {device.panel && (
            <Text>Panel: <Box as="span" color="ui.text">{device.panel}</Box></Text>
          )}
          {device.deviceClass && <Text>|</Text>}
          {device.deviceClass && (
            <Text>Class: <Box as="span" color="ui.text">{device.deviceClass}</Box></Text>
          )}
          {device.pCode && <Text>|</Text>}
          {device.pCode && (
            <Text>Product Code: <Box as="span" color="ui.text">{device.pCode}</Box></Text>
          )}
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
      </Box>

      {/* feature badges - only show flags that are true */}
      {(device.hasClinicalData ||
        device.hasSterilization ||
        device.hasBiocompatibility ||
        device.hasSoftware ||
        device.hasElectricalSafety) && (
        <HStack gap="2" flexWrap="wrap" mb="3">
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
        <Text fontSize="sm" color="ui.textMuted" mb="3">
          <Box as="span" fontWeight="medium">Materials:</Box>{" "}
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
          mb="3"
          display="block"
        >
          View safety data &rarr;
        </Box>
      </Link>

      {device.snippet && (
        <Box>
          {/* snippet source label - shows which field the snippet was extracted from */}
          {device.snippetSource && (
            <Text fontSize="xs" color="ui.textMuted" fontStyle="italic" mb="1">
              {device.snippetSource === "indications_for_use"
                ? "from indications for use"
                : device.snippetSource === "device_description"
                  ? "from device description"
                  : device.snippetSource === "summary_text"
                    ? "from summary"
                    : null}
            </Text>
          )}
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
                read more
              </Box>
            </>
          )}
          </Box>
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
