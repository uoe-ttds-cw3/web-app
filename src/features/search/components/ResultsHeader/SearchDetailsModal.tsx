import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  HStack,
  Portal,
  Text,
} from "@chakra-ui/react";
import type { QueryDebugInfo } from "@/lib/api/types";

export type SearchDetailsModalProps = {
  debugInfo?: QueryDebugInfo | null;
};

export const SearchDetailsModal = ({ debugInfo }: SearchDetailsModalProps) => {
  const [open, setOpen] = useState(false);

  if (!debugInfo) {
    return null;
  }

  const stages: Array<{ label: string; count: number }> = [];
  const total = debugInfo.total_before_metadata_filters;

  if (total > 0) {
    stages.push({ label: "Candidates", count: total });

    const filters: Array<{ label: string; count: number }> = [
      {
        label: "After panel filter",
        count: debugInfo.candidates_after_panel_filter,
      },
      {
        label: "After class filter",
        count: debugInfo.candidates_after_class_filter,
      },
      {
        label: "After decision filter",
        count: debugInfo.candidates_after_decision_filter,
      },
      {
        label: "After product code filter",
        count: debugInfo.candidates_after_product_code_filter,
      },
      {
        label: "After date filter",
        count: debugInfo.candidates_after_date_filter,
      },
    ];

    let prev = total;
    for (const filter of filters) {
      if (filter.count !== undefined && filter.count !== prev) {
        stages.push(filter);
        prev = filter.count;
      }
    }
  }

  return (
    <>
      <Box
        as="button"
        fontSize="xs"
        color="ui.textMuted"
        cursor="pointer"
        _hover={{ color: "brand.primary" }}
        onClick={() => setOpen(true)}
      >
        Search details
      </Box>

      {open && (
        <Portal>
          <Box position="fixed" inset="0" zIndex={1200}>
            <Box
              position="absolute"
              inset="0"
              bg="blackAlpha.500"
              onClick={() => setOpen(false)}
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width={{ base: "calc(100% - 2rem)", md: "720px" }}
              maxWidth="720px"
              maxHeight="80vh"
              overflowY="auto"
              backgroundColor="ui.surface"
              border="1px solid"
              borderColor="ui.borderLight"
              borderRadius="12px"
              boxShadow="2xl"
              p={{ base: 4, md: 5 }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom="4"
                gap="3"
              >
                <Text fontSize="md" fontWeight="semibold" color="ui.text">
                  Search details
                </Text>
                <Button
                  size="sm"
                  variant="ghost"
                  color="ui.textMuted"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </Box>

              <Box fontSize="xs">
                <Box marginBottom="4">
                  <Text
                    fontWeight="semibold"
                    color="ui.text"
                    marginBottom="2"
                    fontSize="xs"
                  >
                    Query processing
                  </Text>
                  <HStack gap="1" flexWrap="wrap" marginBottom="2">
                    {debugInfo.processed_terms.map((term, i) => (
                      <Badge
                        key={i}
                        size="sm"
                        variant="subtle"
                        colorPalette="blue"
                      >
                        {term}
                      </Badge>
                    ))}
                    {debugInfo.removed_stopwords?.length > 0 &&
                      debugInfo.removed_stopwords.map((sw, i) => (
                        <Badge
                          key={`sw-${i}`}
                          size="sm"
                          variant="subtle"
                          colorPalette="gray"
                          textDecoration="line-through"
                        >
                          {sw}
                        </Badge>
                      ))}
                  </HStack>
                  {debugInfo.query_transformations?.length > 0 && (
                    <Box color="ui.textMuted" fontSize="xs">
                      {debugInfo.query_transformations.map((t, i) => (
                        <Text key={i} display="inline" marginRight="3">
                          {t.original} → {t.stemmed}
                        </Text>
                      ))}
                    </Box>
                  )}
                </Box>

                <Box marginBottom={stages.length > 1 ? "4" : "0"}>
                  <Text
                    fontWeight="semibold"
                    color="ui.text"
                    marginBottom="1"
                    fontSize="xs"
                  >
                    Retrieval
                  </Text>
                  <Text color="ui.textMuted" fontSize="xs">
                    Found {debugInfo.bm25_candidates} keyword matches and{" "}
                    {debugInfo.dense_candidates} semantic matches in{" "}
                    {Math.round(debugInfo.retrieval_time_ms)}ms.
                  </Text>
                </Box>

                {stages.length > 1 && (
                  <Box>
                    <Text
                      fontWeight="semibold"
                      color="ui.text"
                      marginBottom="1"
                      fontSize="xs"
                    >
                      Filter funnel
                    </Text>
                    {stages.map((stage, i) => (
                      <HStack key={i} gap="2" marginBottom="0.5">
                        <Text
                          color="ui.textMuted"
                          fontSize="xs"
                          fontFamily="mono"
                          minW="5ch"
                          textAlign="right"
                        >
                          {stage.count}
                        </Text>
                        <Text color="ui.textMuted" fontSize="xs">
                          {stage.label}
                        </Text>
                      </HStack>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Portal>
      )}
    </>
  );
};
