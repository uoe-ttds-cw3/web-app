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
import Highlighter from "react-highlight-words";
import { useState } from "react";
import { useRouter } from "next/router";
import type { Device } from "@/lib/api/types";
import Link from "next/link";
import { MetadataRow } from "./MetadataRow";
import { TitleRow } from "./TitleRow";

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
      <TitleRow device={device} searchQuery={searchQuery} />

      <MetadataRow device={device} />

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
          borderRadius="md"
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
