import { Input, Box, Text, Link, Icon, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import posthog from "posthog-js";
import { FilterMenu } from "./FilterMenu";
import { SearchTags } from "../SearchTags";
import { AdvancedSearchPanel } from "../AdvancedSearchModal";
import { useAutocomplete } from "@/lib/queries/useAutocomplete";
import { defaultBackendOptions, type BackendOptions } from "@/lib/api/types";

export const HEADER_SEARCH_FORM_ID = "header-search-form";

interface SearchFormProps {
  onSearch?: (
    query: string,
    tags?: Array<{ id: string; type: string; value: string }>,
    backendOptions?: BackendOptions,
  ) => void;
  onBackendOptionsChange?: (backendOptions: BackendOptions) => void;
  backendOptions?: BackendOptions;
  initialQuery?: string;
  advancedPanelOpen?: boolean;
  onAdvancedPanelOpenChange?: (isOpen: boolean) => void;
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

export const SearchForm = ({
  onSearch,
  onBackendOptionsChange,
  backendOptions,
  initialQuery,
  advancedPanelOpen = false,
  onAdvancedPanelOpenChange,
}: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery ?? "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const effectiveBackendOptions = backendOptions ?? defaultBackendOptions;

  useEffect(() => {
    if (initialQuery !== undefined) setSearchTerm(initialQuery);
  }, [initialQuery]);

  const [searchFocused, setSearchFocused] = useState(false);
  const [filterFocused, setFilterFocused] = useState(false);
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

  function handleBackendOptionsChange(nextOptions: BackendOptions) {
    onBackendOptionsChange?.(nextOptions);
  }

  function updateTagValue(tagId: string, newValue: string) {
    setTags(
      tags.map((tag) => (tag.id === tagId ? { ...tag, value: newValue } : tag)),
    );
  }

  function removeTag(tagId: string) {
    const updatedTags = tags.filter((tag) => tag.id !== tagId);
    setTags(updatedTags);
    onSearch?.(searchTerm, updatedTags, effectiveBackendOptions);
  }

  function submitSearch() {
    onSearch?.(searchTerm, tags, effectiveBackendOptions);
    setSearchFocused(false);
  }

  return (
    <Box
      as="form"
      id={HEADER_SEARCH_FORM_ID}
      width="100%"
      position="relative"
      onSubmit={(e) => {
        e.preventDefault();
        submitSearch();
      }}
    >
      {filterFocused && (
        <Box
          position="fixed"
          inset="0"
          zIndex={9}
          onClick={() => setFilterFocused(false)}
        />
      )}

      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        position="relative"
      >
        <Box display="flex" alignItems="stretch" gap="8px">
          <Box
            display="flex"
            alignItems="center"
            gap="12px"
            flex="1"
            minH="48px"
            backgroundColor="ui.background"
            borderRadius="8px"
            paddingLeft="16px"
            paddingRight="16px"
            border="1px solid"
            borderColor="ui.borderLight"
          >
            <Icon
              as={FaSearch}
              color="brand.primary"
              boxSize="4"
              flexShrink={0}
            />

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
                  onEnter={submitSearch}
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
                  : "Search by manufacturer, material, device name"
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
              }}
            />
          </Box>

          <Box position="relative" flexShrink={0}>
            <IconButton
              aria-label="Open filters"
              type="button"
              onClick={() => setFilterFocused(!filterFocused)}
              minH="48px"
              minW="48px"
              borderRadius="8px"
              backgroundColor="ui.background"
              border="1px solid"
              borderColor="ui.borderLight"
              color="brand.primary"
              _hover={{ backgroundColor: "ui.surface" }}
              _active={{ backgroundColor: "ui.surface" }}
            >
              <Icon as={FaFilter} boxSize="4" />
            </IconButton>

            <FilterMenu
              isOpen={filterFocused}
              onClose={() => setFilterFocused(false)}
              onFilterSelect={applyFilter}
            />
          </Box>
        </Box>

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
              top="100%"
              left="0"
              zIndex={10}
              boxShadow="lg"
              border="1px solid"
              borderColor="ui.borderLight"
              onMouseDown={(e) => e.preventDefault()}
            >
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
                        onSearch?.(
                          suggestion.text,
                          tags,
                          effectiveBackendOptions,
                        );
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
                        onSearch?.(
                          suggestion.text,
                          tags,
                          effectiveBackendOptions,
                        );
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

      </Box>

      <AdvancedSearchPanel
        isOpen={advancedPanelOpen}
        onClose={() => onAdvancedPanelOpenChange?.(false)}
        options={effectiveBackendOptions}
        onOptionsChange={handleBackendOptionsChange}
        onSearch={handleAdvancedSearch}
      />
    </Box>
  );
};
