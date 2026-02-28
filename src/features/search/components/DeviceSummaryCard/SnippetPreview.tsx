import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Highlighter from "react-highlight-words";
import type { Device } from "@/lib/api/types";

export type SnippetPreviewProps = {
  device: Device;
  searchQuery?: string;
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
      ? "Excerpt from indications for use"
      : device.snippetSource === "device_description"
        ? "Excerpt from device description"
        : device.snippetSource === "summary_text"
          ? "Excerpt from summary"
          : null;

  return (
    <Box>
      {device.snippetSource && (
        <Text fontSize="xs" color="ui.textMuted" fontStyle="italic" mb="1">
          {snippetSourceLabel}
        </Text>
      )}
      <Box
        fontSize="sm"
        color="ui.textMuted"
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
  );
};
