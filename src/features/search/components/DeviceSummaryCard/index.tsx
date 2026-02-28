import {
  Box,
  HStack,
  Text,
  Checkbox,
  Badge,
  Link as ChakraLink,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import { useRouter } from "next/router";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";
import Link from "next/link";

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
  const tooltipProps = {
    bg: "ui.background",
    color: "ui.text",
    px: 2,
    py: 1,
    borderRadius: "md",
  };
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
        {/* match reason badge - tells user why this result matched */}
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
            padding="0 0.25rem"
          >
            {device.retrievalSource === "keyword"
              ? "Keyword match"
              : device.retrievalSource === "semantic"
                ? "Semantic match"
                : "Keyword & semantic match"}
          </Badge>
        )}
        {/* adverse event badge - device-specific from maude k-number cache */}
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

      <Box fontSize={{ base: "xs", md: "sm" }} color="ui.textMuted" mb="3">
        {/* stacked on mobile, inline with pipes on desktop */}
        <Box
          display={{ base: "flex", md: "none" }}
          flexDirection="column"
          gap="1"
        >
          {device.manufacturer && (
            <Text>
              Manufacturer:{" "}
              <Box
                as="span"
                color="brand.primary"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={() =>
                  router.push({
                    pathname: "/",
                    query: { q: device.manufacturer },
                  })
                }
              >
                {device.manufacturer}
              </Box>
            </Text>
          )}
          {device.date && (
            <Text>
              Date:{" "}
              <Box as="span" color="ui.text">
                {device.date}
              </Box>
            </Text>
          )}
          <HStack gap="3" flexWrap="wrap">
            {device.panel && (
              <Text>
                Panel:{" "}
                <Box as="span" color="ui.text">
                  {device.panel}
                </Box>
              </Text>
            )}
            {device.deviceClass && (
              <Text>
                Class:{" "}
                <Box as="span" color="ui.text">
                  {device.deviceClass}
                </Box>
              </Text>
            )}
            {device.pCode && (
              <Text>
                Code:{" "}
                <Box as="span" color="ui.text">
                  {device.pCode}
                </Box>
              </Text>
            )}
          </HStack>
        </Box>

        {/* desktop: inline with pipe separators */}
        <HStack display={{ base: "none", md: "flex" }} gap="3" flexWrap="wrap">
          {device.sponsor && (
            <Text>
              Manufacturer:{" "}
              <ChakraLink
                asChild
                color="brand.primary"
                textDecoration="underline"
              >
                <Link href={`/q=${device.sponsor}`} color="brand.primary">
                  {device.sponsor}
                </Link>
              </ChakraLink>
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
              Clinical data
            </Badge>
          )}
          {device.hasSterilization && (
            <Badge variant="subtle" colorPalette="gray" fontSize="xs">
              Sterilization
            </Badge>
          )}
          {device.hasBiocompatibility && (
            <Badge variant="subtle" colorPalette="gray" fontSize="xs">
              Biocompatibility
            </Badge>
          )}
          {device.hasSoftware && (
            <Badge variant="subtle" colorPalette="gray" fontSize="xs">
              Software
            </Badge>
          )}
          {device.hasElectricalSafety && (
            <Badge variant="subtle" colorPalette="gray" fontSize="xs">
              Electrical safety
            </Badge>
          )}
        </HStack>
      )}

      {/* materials */}
      {device.materials.length > 0 && (
        <Text fontSize="sm" color="ui.textMuted" mb="3">
          <Box as="span" fontWeight="medium">
            Materials:
          </Box>{" "}
          {device.materials.join(" · ")}
        </Text>
      )}

      <ChakraLink asChild color="brand.primary" mb="4">
        <Link href={`/devices/${device.id}`}>View safety data &rarr;</Link>
      </ChakraLink>

      {device.snippet && (
        <Box>
          {/* snippet source label - shows which field the snippet was extracted from */}
          {device.snippetSource && (
            <Text fontSize="xs" color="ui.textMuted" fontStyle="italic" mb="1">
              {device.snippetSource === "indications_for_use"
                ? "From indications for use"
                : device.snippetSource === "device_description"
                  ? "From device description"
                  : device.snippetSource === "summary_text"
                    ? "From summary"
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
                  Read more
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}

      <Box mt="4">
        <Grid
          templateColumns="repeat(2, 1fr)"
          gap={4}
          p={4}
          border="1px solid"
          borderColor="gray.200"
        >
          <GridItem justifySelf="start">
            <Checkbox.Root
              cursor="pointer"
              checked={isSelected}
              onCheckedChange={() => onToggle(device)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Add to comparison</Checkbox.Label>
            </Checkbox.Root>
          </GridItem>

          <GridItem justifySelf="end">
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
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};
