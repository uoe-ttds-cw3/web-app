import { Box, Text } from "@chakra-ui/react";
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import posthog from "posthog-js";
import type { BackendOptions } from "@/lib/api/types";
import { QueryBuilderSection } from "./QueryBuilderSection";
import { SearchOptionsSection } from "./SearchOptionsSection";
import { SnapshotDateSection } from "./SnapshotDateSection";
import type { Joiner, QueryRow } from "./types";

interface AdvancedSearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  options: BackendOptions;
  onOptionsChange: (options: BackendOptions) => void;
  onSearch: (query: string, backendOptions: BackendOptions) => void;
}

const createRow = (): QueryRow => ({
  id: String(Date.now()) + String(Math.random()).slice(2, 6),
  operator: "contains",
  value1: "",
  value2: "",
  distance: "5",
});

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

export const AdvancedSearchPanel = ({
  isOpen,
  onClose,
  options,
  onOptionsChange,
  onSearch,
}: AdvancedSearchPanelProps) => {
  const [rows, setRows] = useState<QueryRow[]>([createRow()]);
  const [joiners, setJoiners] = useState<Joiner[]>([]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const queryPreview = useMemo(() => {
    const fragments = rows.map(buildRowFragment).filter(Boolean);
    if (fragments.length === 0) return "";
    if (fragments.length === 1) return fragments[0];

    return fragments.reduce((acc, frag, i) => {
      if (i === 0) return frag;
      const joiner = joiners[i - 1] || "AND";
      return `${acc} ${joiner} ${frag}`;
    });
  }, [rows, joiners]);

  function updateRow(id: string, updates: Partial<QueryRow>) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...updates } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, createRow()]);
    setJoiners((prev) => [...prev, "AND"]);
  }

  function removeRow(id: string) {
    if (rows.length <= 1) return;

    const index = rows.findIndex((row) => row.id === id);
    setRows((prev) => prev.filter((row) => row.id !== id));
    setJoiners((prev) => {
      const next = [...prev];
      if (index > 0) next.splice(index - 1, 1);
      else if (next.length > 0) next.splice(0, 1);
      return next;
    });
  }

  function toggleJoiner(index: number) {
    setJoiners((prev) => {
      const next = [...prev];
      next[index] = next[index] === "AND" ? "OR" : "AND";
      return next;
    });
  }

  function toggleOption(key: keyof BackendOptions) {
    onOptionsChange({ ...options, [key]: !options[key] });
  }

  function handleSearch() {
    if (!queryPreview) return;

    posthog.capture("advanced_search_used", {
      query: queryPreview,
      condition_count: rows.length,
      operators_used: rows.map((row) => row.operator),
      use_expansion: options.use_expansion,
      use_pagerank_boost: options.use_pagerank_boost,
      use_stemming: options.use_stemming,
      use_hybrid: options.use_hybrid,
    });

    onSearch(queryPreview, options);
    onClose();
  }

  function handleKeyDown(e: ReactKeyboardEvent) {
    if (e.key === "Enter" && queryPreview) {
      e.preventDefault();
      handleSearch();
    }
  }

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={100}
      onKeyDown={handleKeyDown}
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      padding={{ base: "16px", md: "24px" }}
      bg="blackAlpha.400"
      onClick={onClose}
    >
      <Box
        width="100%"
        maxW="760px"
        maxH="min(80vh, 900px)"
        overflowY="auto"
        background="ui.background"
        borderRadius="12px"
        boxShadow="xl"
        border="1px solid"
        borderColor="ui.borderLight"
        padding="16px"
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb="12px"
        >
          <Text fontWeight="600" fontSize="sm" color="brand.primary">
            Advanced query builder
          </Text>
          <Box
            as="button"
            type="button"
            onClick={onClose}
            cursor="pointer"
            _hover={{ opacity: 0.7 }}
            display="flex"
            alignItems="center"
          >
            <FaTimes size={14} color="#666" />
          </Box>
        </Box>

        <QueryBuilderSection
          rows={rows}
          joiners={joiners}
          queryPreview={queryPreview}
          onUpdateRow={updateRow}
          onToggleJoiner={toggleJoiner}
          onRemoveRow={removeRow}
          onAddRow={addRow}
          onRunSearch={handleSearch}
        />

        <SearchOptionsSection options={options} onToggleOption={toggleOption} />

        <SnapshotDateSection />
      </Box>
    </Box>
  );
};
