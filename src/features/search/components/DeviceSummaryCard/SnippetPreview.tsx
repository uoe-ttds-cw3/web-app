import { Box, Button, HStack, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Highlighter from "react-highlight-words";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";

export type SnippetPreviewProps = {
  device: Device;
  searchQuery?: string;
};

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
  maxW: "320px",
};

const HIGHLIGHT_STYLE = {
  fontWeight: 600,
  backgroundColor: "rgba(30, 90, 168, 0.12)",
  borderRadius: "2px",
};

export const SnippetPreview = ({
  device,
  searchQuery = "",
}: SnippetPreviewProps) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  if (!device.snippet) {
    return null;
  }

  const shouldTruncate = device.snippet.length > 200;
  const displaySnippet =
    shouldTruncate && !expanded ? device.snippet.slice(0, 200) : device.snippet;

  const snippetSourceLabel =
    device.snippetSource === "indications_for_use"
      ? "EXCERPT FROM INDICATIONS FOR USE"
      : device.snippetSource === "device_description"
        ? "EXCERPT FROM DEVICE DESCRIPTION"
        : device.snippetSource === "summary_text"
          ? "EXCERPT FROM SUMMARY"
          : null;

  const sectionLabel = snippetSourceLabel || "Excerpt";

  return (
    <Box p="2" border="1px solid" borderColor="gray.200" borderRadius="md">
      <HStack gap="1" mb="2" alignItems="center" flexWrap="wrap">
        <Text fontSize="xs" color="ui.textMuted">
          {sectionLabel}
        </Text>
        <Tooltip
          content="This excerpt is selected from the matched submission text to show why the result was returned."
          showArrow
          openDelay={200}
          contentProps={TOOLTIP_PROPS}
        >
          <Button
            type="button"
            color="ui.textMuted"
            cursor="help"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            bg="transparent"
            minW="unset"
            minH="unset"
            height="auto"
            p="0"
            _hover={{ bg: "transparent", color: "ui.text" }}
            _active={{ bg: "transparent" }}
            aria-label="How the excerpt is chosen"
          >
            <Icon as={LuInfo} boxSize="3.5" />
          </Button>
        </Tooltip>
      </HStack>
      <Box
        fontSize="sm"
        color="ui.text"
        userSelect="text"
        cursor="text"
        onDoubleClick={(e) => {
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
            highlightStyle={HIGHLIGHT_STYLE}
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
  );
};
