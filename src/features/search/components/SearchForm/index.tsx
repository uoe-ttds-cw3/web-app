import { Input, Box, Text, Link } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import posthog from "posthog-js";
import { FilterMenu } from "../FilterMenu";
import { SearchTags } from "../SearchTags";
import { AdvancedSearchPanel } from "../AdvancedSearchModal";
import { useAutocomplete } from "@/lib/queries/useAutocomplete";
import type { BackendOptions } from "@/lib/api/types";

interface SearchFormProps {
  onSearch?: (
    query: string,
    tags?: Array<{ id: string; type: string; value: string }>,
    backendOptions?: BackendOptions,
  ) => void;
  initialQuery?: string;
}

// simple gibberish detection without external library
const isLikelyGibberish = (text: string): boolean => {
  if (text.length < 3) return false;
  const consonantCluster = /[^aeiou\s]{5,}/i;
  const repeatedChars = /(.)\1{3,}/;
  const keyboardMash = /[qwertasdfgzxcvb]{6,}/i;
  return (
    consonantCluster.test(text) ||
    repeatedChars.test(text) ||
    keyboardMash.test(text)
  );
};

export const SearchForm = ({ onSearch, initialQuery }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery ?? "");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (initialQuery !== undefined) setSearchTerm(initialQuery);
  }, [initialQuery]);

  const [searchFocused, setSearchFocused] = useState(false);
  const [filterFocused, setFilterFocused] = useState(false);
  const [advancedPanelOpen, setAdvancedPanelOpen] = useState(false);
  const [tags, setTags] = useState<
    Array<{ id: string; type: string; value: string }>
  >([]);
  const [showGibberishWarning, setShowGibberishWarning] = useState(false);

  const { data: autocompleteData } = useAutocomplete(searchTerm);
  const suggestions = autocompleteData?.suggestions ?? [];

  // group suggestions by source type
  const deviceSuggestions = suggestions.filter(
    (s) =>
      s.source === "device_name" ||
      s.source === "product_code" ||
      s.source === "device_term",
  );
  const manufacturerSuggestions = suggestions.filter(
    (s) => s.source === "manufacturer",
  );

  // check for gibberish and update warning state
  useEffect(() => {
    if (searchTerm.length >= 3) {
      setShowGibberishWarning(isLikelyGibberish(searchTerm));
    } else {
      setShowGibberishWarning(false);
    }
  }, [searchTerm]);

  const filterTypeMap = {
    productCode: "Product Code",
    submissionNumber: "Submission No.",
    dateBefore: "Before",
    dateAfter: "After",
  };

  function applyFilter(filterId: string) {
    const filterType = filterTypeMap[filterId as keyof typeof filterTypeMap];
    const newTag = {
      id: `${filterId}-${Date.now()}`,
      type: filterType,
      value: "",
    };
    setTags([...tags, newTag]);
  }

  function handleAdvancedSearch(query: string, backendOptions: BackendOptions) {
    setSearchTerm(query);
    onSearch?.(query, tags, backendOptions);
  }

  function updateTagValue(tagId: string, newValue: string) {
    setTags(
      tags.map((tag) => (tag.id === tagId ? { ...tag, value: newValue } : tag)),
    );
  }

  function removeTag(tagId: string) {
    const updatedTags = tags.filter((tag) => tag.id !== tagId);
    setTags(updatedTags);
    onSearch?.(searchTerm, updatedTags);
  }

  return (
    <Box position="relative" width="100%">
      {/* backdrop to close filter menu */}
      {filterFocused && (
        <Box
          position="fixed"
          inset="0"
          zIndex={9}
          onClick={() => setFilterFocused(false)}
        />
      )}

      {/* backdrop to close advanced panel */}
      {advancedPanelOpen && (
        <Box
          position="fixed"
          inset="0"
          zIndex={99}
          onClick={() => setAdvancedPanelOpen(false)}
        />
      )}

      <Box
        display="flex"
        alignItems="center"
        gap="8px"
        backgroundColor="ui.background"
        borderRadius="8px"
        paddingLeft="16px"
        paddingRight="16px"
        border="1px solid"
        borderColor="ui.borderLight"
      >
        <FaSearch color="var(--chakra-colors-brand-accent)" />

        <Box
          display="flex"
          gap="4px"
          overflowX="auto"
          flexShrink={0}
          maxWidth="60%"
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {tags.map((tag) => (
            <SearchTags
              key={tag.id}
              filterType={tag.type}
              value={tag.value}
              onChange={(newValue) => updateTagValue(tag.id, newValue)}
              onRemove={() => removeTag(tag.id)}
              onEnter={() => onSearch?.(searchTerm, tags)}
            />
          ))}
        </Box>

        <Input
          flex="1"
          borderRadius="8px"
          colorPalette="gray"
          placeholder={
            tags.length > 0
              ? ""
              : "Search by manufacturer, material, recall event"
          }
          border="none"
          _focus={{ boxShadow: "none", outline: "none" }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!searchFocused) setSearchFocused(true);
          }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => {
            setSearchFocused(false);
            setFilterFocused(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch?.(searchTerm, tags);
              setSearchFocused(false);
            }
          }}
        />

        <Box
          onClick={() => setFilterFocused(!filterFocused)}
          cursor="pointer"
          display="flex"
          alignItems="center"
        >
          <FaFilter color="var(--chakra-colors-brand-accent)" />
        </Box>
      </Box>

      <Box position="absolute" right="0" top="100%" marginBottom="4px">
        <Box
          as="button"
          fontSize="xs"
          color="brand.primary"
          textDecoration="underline"
          cursor="pointer"
          padding="8px 4px"
          onClick={() => {
            setAdvancedPanelOpen(true);
            setFilterFocused(false);
            setSearchFocused(false);
          }}
        >
          Advanced Search
        </Box>
      </Box>

      {/* grouped autocomplete dropdown */}
      {searchFocused &&
        !advancedPanelOpen &&
        (deviceSuggestions.length > 0 ||
          manufacturerSuggestions.length > 0) && (
          <Box
            width="100%"
            background="ui.background"
            borderRadius="8px"
            marginTop="12px"
            position="absolute"
            zIndex={10}
            boxShadow="lg"
            border="1px solid"
            borderColor="ui.borderLight"
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* devices section */}
            {deviceSuggestions.length > 0 && (
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="ui.textMuted"
                  padding="8px 12px 4px"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Devices
                </Text>
                {deviceSuggestions.map((suggestion, index) => (
                  <Link
                    key={`${suggestion.text}-${index}`}
                    onClick={() => {
                      // track autocomplete suggestion selected
                      posthog.capture("autocomplete_suggestion_selected", {
                        suggestion_text: suggestion.text,
                        suggestion_source: suggestion.source,
                        suggestion_type: "device",
                        typed_query: searchTerm,
                      });
                      setSearchTerm(suggestion.text);
                      onSearch?.(suggestion.text, tags);
                      setSearchFocused(false);
                    }}
                    display="block"
                    width="100%"
                    padding="8px 12px"
                    borderRadius="4px"
                    _hover={{
                      bg: "ui.surface",
                      textDecoration: "none",
                    }}
                    cursor="pointer"
                  >
                    <Text fontSize="sm">{suggestion.text}</Text>
                    <Text fontSize="xs" color="ui.textSubtle">
                      {suggestion.source === "product_code"
                        ? "product code"
                        : suggestion.source === "device_term"
                          ? "device type"
                          : "device name"}
                    </Text>
                  </Link>
                ))}
              </Box>
            )}

            {/* manufacturers section */}
            {manufacturerSuggestions.length > 0 && (
              <Box
                borderTop={
                  deviceSuggestions.length > 0 ? "1px solid" : undefined
                }
                borderColor="ui.borderLight"
              >
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="ui.textMuted"
                  padding="8px 12px 4px"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Manufacturers
                </Text>
                {manufacturerSuggestions.map((suggestion, index) => (
                  <Link
                    key={`${suggestion.text}-${index}`}
                    onClick={() => {
                      // track autocomplete suggestion selected
                      posthog.capture("autocomplete_suggestion_selected", {
                        suggestion_text: suggestion.text,
                        suggestion_source: suggestion.source,
                        suggestion_type: "manufacturer",
                        typed_query: searchTerm,
                      });
                      setSearchTerm(suggestion.text);
                      onSearch?.(suggestion.text, tags);
                      setSearchFocused(false);
                    }}
                    display="block"
                    width="100%"
                    padding="8px 12px"
                    borderRadius="4px"
                    _hover={{
                      bg: "ui.surface",
                      textDecoration: "none",
                    }}
                    cursor="pointer"
                  >
                    <Text fontSize="sm">{suggestion.text}</Text>
                    <Text fontSize="xs" color="ui.textSubtle">
                      manufacturer
                    </Text>
                  </Link>
                ))}
              </Box>
            )}
          </Box>
        )}

      <FilterMenu
        isOpen={filterFocused}
        onClose={() => setFilterFocused(false)}
        onFilterSelect={applyFilter}
        onAdvancedSearchToggle={() => {
          setAdvancedPanelOpen((prev) => !prev);
          setFilterFocused(false);
        }}
      />

      {/* advanced search panel below search bar */}
      <AdvancedSearchPanel
        isOpen={advancedPanelOpen}
        onClose={() => setAdvancedPanelOpen(false)}
        onSearch={handleAdvancedSearch}
      />
    </Box>
  );
};
