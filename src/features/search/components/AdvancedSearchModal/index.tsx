import { Box, Input, Text, NativeSelect } from "@chakra-ui/react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { FaPlus, FaTimes, FaSearch } from "react-icons/fa";
import posthog from "posthog-js";
import type { BackendOptions } from "@/lib/api/types";
import { defaultBackendOptions } from "@/lib/api/types";
import { Tooltip } from "@/components/ui/Tooltip";

type Operator = "contains" | "AND" | "OR" | "NOT" | "phrase" | "proximity";

interface QueryRow {
  id: string;
  operator: Operator;
  value1: string;
  value2: string;
  distance: string;
}

interface AdvancedSearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string, backendOptions: BackendOptions) => void;
}

const createRow = (): QueryRow => ({
  id: String(Date.now()) + String(Math.random()).slice(2, 6),
  operator: "contains",
  value1: "",
  value2: "",
  distance: "5",
});

// build query fragment from a single row
function buildRowFragment(row: QueryRow): string {
  const v1 = row.value1.trim();
  const v2 = row.value2.trim();

  switch (row.operator) {
    case "contains":
      return v1;
    case "AND":
      return v1 && v2 ? `${v1} AND ${v2}` : v1 || v2;
    case "OR":
      return v1 && v2 ? `${v1} OR ${v2}` : v1 || v2;
    case "NOT":
      return v1 && v2 ? `${v1} NOT ${v2}` : v1;
    case "phrase":
      return v1 ? `"${v1}"` : "";
    case "proximity":
      return v1 && v2 ? `${v1} NEAR/${row.distance || "5"} ${v2}` : v1 || v2;
    default:
      return "";
  }
}

const needsTwoInputs = (op: Operator) =>
  ["AND", "OR", "NOT", "proximity"].includes(op);

// toggle pill for backend options
const OptionPill = ({
  label,
  active,
  onClick,
  tooltip,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tooltip?: string;
}) => {
  const pill = (
    <Box
      as="button"
      onClick={onClick}
      px="8px"
      py="3px"
      borderRadius="12px"
      fontSize="xs"
      cursor="pointer"
      bg={active ? "brand.greenBg" : "transparent"}
      color={active ? "brand.primary" : "ui.textMuted"}
      border="1px solid"
      borderColor={active ? "brand.primary" : "ui.borderLight"}
      transition="all 0.15s"
      _hover={{ opacity: 0.8 }}
      whiteSpace="nowrap"
    >
      {label}
    </Box>
  );
  return tooltip ? (
    <Tooltip
      content={tooltip}
      showArrow={false}
      openDelay={300}
      interactive
      color="white"
      contentProps={{
        bg: "ui.background",
        color: "ui.text",
        px: 2,
        py: 1,
        borderRadius: "md",
      }}
    >
      {pill}
    </Tooltip>
  ) : (
    pill
  );
};

export const AdvancedSearchPanel = ({
  isOpen,
  onClose,
  onSearch,
}: AdvancedSearchPanelProps) => {
  const [rows, setRows] = useState<QueryRow[]>([createRow()]);
  const [options, setOptions] = useState<BackendOptions>({
    ...defaultBackendOptions,
  });

  // close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // live query preview - all conditions joined with AND
  const queryPreview = useMemo(() => {
    const fragments = rows.map(buildRowFragment).filter(Boolean);
    if (fragments.length === 0) return "";
    if (fragments.length === 1) return fragments[0];
    return fragments.join(" AND ");
  }, [rows]);

  const updateRow = useCallback((id: string, updates: Partial<QueryRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    );
  }, []);

  const addRow = () => {
    setRows((prev) => [...prev, createRow()]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleOption = (key: keyof BackendOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = () => {
    if (!queryPreview) return;
    // track advanced search usage
    posthog.capture("advanced_search_used", {
      query: queryPreview,
      condition_count: rows.length,
      operators_used: rows.map((r) => r.operator),
      use_expansion: options.use_expansion,
      use_pagerank_boost: options.use_pagerank_boost,
      use_stemming: options.use_stemming,
      use_hybrid: options.use_hybrid,
    });
    onSearch(queryPreview, options);
    onClose();
  };

  // enter key in any input triggers search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && queryPreview) {
      e.preventDefault();
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="relative"
      marginTop="8px"
      background="white"
      borderRadius="8px"
      zIndex={20}
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
      border="1px solid"
      borderColor="ui.borderLight"
      padding="16px"
      onKeyDown={handleKeyDown}
      opacity={isOpen ? 1 : 0}
      transform={isOpen ? "translateY(0)" : "translateY(-8px)"}
      transition="all 0.2s ease-in-out"
    >
      {/* header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="12px"
      >
        <Text fontWeight="600" fontSize="sm" color="brand.primary">
          Query Builder
        </Text>
        <Box
          as="button"
          onClick={onClose}
          cursor="pointer"
          _hover={{ opacity: 0.7 }}
          display="flex"
          alignItems="center"
        >
          <FaTimes size={14} color="#666" />
        </Box>
      </Box>

      {/* query rows */}
      {rows.map((row, index) => (
        <Box key={row.id}>
          {/* and label between rows */}
          {index > 0 && (
            <Box display="flex" justifyContent="center" my="6px">
              <Text
                fontSize="xs"
                fontWeight="600"
                color="brand.primary"
                bg="brand.greenBg"
                px="10px"
                py="2px"
                borderRadius="4px"
              >
                AND
              </Text>
            </Box>
          )}

          {/* row inputs */}
          <Box display="flex" alignItems="center" gap="6px" mb="4px">
            {/* operator dropdown */}
            <NativeSelect.Root size="sm" width="120px" flexShrink={0}>
              <NativeSelect.Field
                value={row.operator}
                onChange={(e) =>
                  updateRow(row.id, {
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

            {/* primary input */}
            <Input
              size="sm"
              placeholder={row.operator === "phrase" ? "enter phrase" : "term"}
              value={row.value1}
              onChange={(e) => updateRow(row.id, { value1: e.target.value })}
              flex="1"
              fontSize="sm"
              paddingLeft="8px"
            />

            {/* secondary input for two-input operators */}
            {needsTwoInputs(row.operator) && (
              <>
                {row.operator === "proximity" && (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap="2px"
                    flexShrink={0}
                  >
                    <Text
                      fontSize="xs"
                      color="ui.textMuted"
                      whiteSpace="nowrap"
                    >
                      NEAR/
                    </Text>
                    <Input
                      size="sm"
                      type="number"
                      value={row.distance}
                      onChange={(e) =>
                        updateRow(row.id, { distance: e.target.value })
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
                  onChange={(e) =>
                    updateRow(row.id, { value2: e.target.value })
                  }
                  flex="1"
                  fontSize="sm"
                  paddingLeft="8px"
                />
              </>
            )}

            {/* remove row button */}
            <Box
              as="button"
              onClick={() => removeRow(row.id)}
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

      {/* add condition */}
      <Box
        as="button"
        onClick={addRow}
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
        <Text fontSize="xs">add condition</Text>
      </Box>

      {/* live query preview */}
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

      {/* backend search options */}
      <Box mb="12px">
        <Text fontSize="xs" color="ui.textMuted" mb="6px">
          search options
        </Text>
        <Box display="flex" flexWrap="wrap" gap="8px">
          <OptionPill
            label="hybrid search"
            active={options.use_hybrid}
            onClick={() => toggleOption("use_hybrid")}
            tooltip="combines keyword matching with semantic similarity for better results"
          />
          <OptionPill
            label="stemming"
            active={options.use_stemming}
            onClick={() => toggleOption("use_stemming")}
            tooltip="matches word variations like 'running' and 'ran'"
          />
          <OptionPill
            label="query expansion"
            active={options.use_expansion}
            onClick={() => toggleOption("use_expansion")}
            tooltip="adds related medical terms to broaden your search"
          />
          <OptionPill
            label="pagerank boost"
            active={options.use_pagerank_boost}
            onClick={() => toggleOption("use_pagerank_boost")}
            tooltip="ranks devices higher if they are frequently cited by other devices"
          />
        </Box>
      </Box>

      {/* search button */}
      <Box
        as="button"
        onClick={handleSearch}
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
        Search
      </Box>
    </Box>
  );
};
