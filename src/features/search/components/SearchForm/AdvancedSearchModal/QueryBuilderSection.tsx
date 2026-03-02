import { Box, Input, NativeSelect, Text } from "@chakra-ui/react";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import type { Joiner, Operator, QueryRow } from "./types";

const needsTwoInputs = (op: Operator) =>
  ["AND", "OR", "NOT", "proximity"].includes(op);

interface QueryBuilderSectionProps {
  rows: QueryRow[];
  joiners: Joiner[];
  queryPreview: string;
  onUpdateRow: (id: string, updates: Partial<QueryRow>) => void;
  onToggleJoiner: (index: number) => void;
  onRemoveRow: (id: string) => void;
  onAddRow: () => void;
  onRunSearch: () => void;
}

export const QueryBuilderSection = ({
  rows,
  joiners,
  queryPreview,
  onUpdateRow,
  onToggleJoiner,
  onRemoveRow,
  onAddRow,
  onRunSearch,
}: QueryBuilderSectionProps) => (
  <Box mb="16px">
    {rows.map((row, index) => (
      <Box key={row.id}>
        {index > 0 && (
          <Box display="flex" justifyContent="center" my="6px">
            <Box
              display="inline-flex"
              borderRadius="4px"
              overflow="hidden"
              border="1px solid"
              borderColor="ui.borderLight"
            >
              <Box
                as="button"
                type="button"
                px="10px"
                py="2px"
                fontSize="xs"
                fontWeight="600"
                cursor="pointer"
                bg={joiners[index - 1] === "AND" ? "brand.accentBg" : "transparent"}
                color={
                  joiners[index - 1] === "AND" ? "brand.primary" : "ui.textMuted"
                }
                onClick={() => onToggleJoiner(index - 1)}
              >
                AND
              </Box>
              <Box
                as="button"
                type="button"
                px="10px"
                py="2px"
                fontSize="xs"
                fontWeight="600"
                cursor="pointer"
                bg={joiners[index - 1] === "OR" ? "brand.accentBg" : "transparent"}
                color={
                  joiners[index - 1] === "OR" ? "brand.primary" : "ui.textMuted"
                }
                onClick={() => onToggleJoiner(index - 1)}
              >
                OR
              </Box>
            </Box>
          </Box>
        )}

        <Box display="flex" alignItems="center" gap="6px" mb="4px">
          <NativeSelect.Root size="sm" width="120px" flexShrink={0}>
            <NativeSelect.Field
              value={row.operator}
              onChange={(e) =>
                onUpdateRow(row.id, {
                  operator: e.target.value as Operator,
                  value2: "",
                  distance: "5",
                })
              }
              fontSize="xs"
              paddingLeft="8px"
            >
              <option value="contains">contains</option>
              <option value="NOT">NOT</option>
              <option value="phrase">phrase</option>
              <option value="proximity">proximity</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <Input
            size="sm"
            placeholder={row.operator === "phrase" ? "enter phrase" : "term"}
            value={row.value1}
            onChange={(e) => onUpdateRow(row.id, { value1: e.target.value })}
            flex="1"
            fontSize="sm"
            paddingLeft="8px"
          />

          {needsTwoInputs(row.operator) && (
            <>
              {row.operator === "proximity" && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap="2px"
                  flexShrink={0}
                >
                  <Text fontSize="xs" color="ui.textMuted" whiteSpace="nowrap">
                    NEAR/
                  </Text>
                  <Input
                    size="sm"
                    type="number"
                    value={row.distance}
                    onChange={(e) =>
                      onUpdateRow(row.id, { distance: e.target.value })
                    }
                    width="45px"
                    fontSize="sm"
                    textAlign="center"
                  />
                </Box>
              )}
              {row.operator !== "proximity" && (
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color="ui.textMuted"
                  whiteSpace="nowrap"
                >
                  {row.operator}
                </Text>
              )}
              <Input
                size="sm"
                placeholder="term"
                value={row.value2}
                onChange={(e) => onUpdateRow(row.id, { value2: e.target.value })}
                flex="1"
                fontSize="sm"
                paddingLeft="8px"
              />
            </>
          )}

          <Box
            as="button"
            type="button"
            onClick={() => onRemoveRow(row.id)}
            cursor={rows.length > 1 ? "pointer" : "not-allowed"}
            opacity={rows.length > 1 ? 1 : 0.3}
            _hover={rows.length > 1 ? { opacity: 0.7 } : {}}
            display="flex"
            alignItems="center"
            flexShrink={0}
          >
            <FaTimes size={12} color="#999" />
          </Box>
        </Box>
      </Box>
    ))}

    <Box
      as="button"
      type="button"
      onClick={onAddRow}
      display="flex"
      alignItems="center"
      gap="4px"
      mt="8px"
      mb="12px"
      cursor="pointer"
      color="brand.primary"
      fontSize="xs"
      _hover={{ opacity: 0.8 }}
    >
      <FaPlus size={10} />
      <Text fontSize="xs">Add condition</Text>
    </Box>

    {queryPreview && (
      <Box
        bg="brand.surface"
        borderRadius="6px"
        padding="8px 12px"
        mb="12px"
        border="1px solid"
        borderColor="ui.borderLight"
      >
        <Text fontSize="xs" color="ui.textMuted" mb="2px">
          query preview
        </Text>
        <Text
          fontSize="sm"
          fontFamily="monospace"
          color="ui.text"
          wordBreak="break-all"
        >
          {queryPreview}
        </Text>
      </Box>
    )}

    <Box
      as="button"
      type="button"
      onClick={onRunSearch}
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap="6px"
      width="100%"
      padding="8px"
      borderRadius="6px"
      bg={queryPreview ? "brand.primary" : "ui.borderLight"}
      color={queryPreview ? "white" : "ui.textMuted"}
      cursor={queryPreview ? "pointer" : "not-allowed"}
      fontSize="sm"
      fontWeight="600"
      _hover={queryPreview ? { opacity: 0.9 } : {}}
      transition="all 0.15s"
    >
      <FaSearch size={12} />
      Run advanced search
    </Box>
  </Box>
);
