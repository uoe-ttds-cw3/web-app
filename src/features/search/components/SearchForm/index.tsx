import { Input, InputGroup, Box, Text, Link } from "@chakra-ui/react";
import { SetStateAction, useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { FilterMenu } from "../FilterMenu";
import { SearchTags } from "../SearchTags";
import { useAutocomplete } from "@/lib/queries/useAutocomplete";

interface SearchFormProps {
  onSearch?: (query: string) => void;
  initialQuery?: string;
}

export const SearchForm = ({ onSearch, initialQuery }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery ?? "");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (initialQuery !== undefined) setSearchTerm(initialQuery);
  }, [initialQuery]);

  const [searchFocused, setSearchFocused] = useState(false);
  const [filterFocused, setFilterFocused] = useState(false);
  const [tags, setTags] = useState<Array<{ id: string; type: string; value: string }>>([]);

  const { data: autocompleteData } = useAutocomplete(searchTerm);
  const suggestions = autocompleteData?.suggestions ?? [];

  const filterTypeMap = {
    category: "Category",
    productCode: "Product Code"
  };

  function applyFilter(filterId: string) {
    const filterType = filterTypeMap[filterId as keyof typeof filterTypeMap];
    const newTag = {
      id: `${filterId}-${Date.now()}`,
      type: filterType,
      value: ""
    };
    setTags([...tags, newTag]);
  }

  function updateTagValue(tagId: string, newValue: string) {
    setTags(tags.map(tag => tag.id === tagId ? { ...tag, value: newValue } : tag));
  }

  function removeTag(tagId: string) {
    setTags(tags.filter(tag => tag.id !== tagId));
  }

  // using react hook form
  // in onValid callback func
  // construct request to include search term and selected category

  return (
    <Box position="relative" width="100%">
      {filterFocused && (
        <Box
          position="fixed"
          zIndex={9}
          onClick={() => setFilterFocused(false)}
        />
      )}
      <Box
        display="flex"
        alignItems="center"
        gap="8px"
        backgroundColor="#FFFFFFFF"
        borderRadius="8px"
        paddingLeft="16px"
        paddingRight="16px"
      >
        <FaSearch color="#4CAF50" />

        <Box
          display="flex"
          gap="4px"
          overflowX="auto"
          flexShrink={0}
          maxWidth="60%"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {tags.map((tag) => (
            <SearchTags
              key={tag.id}
              filterType={tag.type}
              value={tag.value}
              onChange={(newValue) => updateTagValue(tag.id, newValue)}
              onRemove={() => removeTag(tag.id)}
            />
          ))}
        </Box>

        <Input
          flex="1"
          borderRadius="8px"
          colorPalette="gray"
          placeholder={tags.length > 0 ? "" : "Search by manufacturer, material, recall event"}
          border="none"
          _focus={{ boxShadow: "none", outline: "none" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => {
            setSearchFocused(false);
            setFilterFocused(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch?.(searchTerm);
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
          <FaFilter color="#4CAF50" />
        </Box>
      </Box>

      {/* <Box marginTop="6px" fontSize="xs" color="#666">
        <Text>
          Tags: {tags.length > 0
            ? tags.map((tag) => `${tag.type}: ${tag.value || "(empty)"}`).join(", ")
            : "(none)"}
        </Text>
        <Text>Search key: {searchTerm || "(none)"}</Text>
      </Box> */}

      {searchFocused && suggestions.length > 0 && (
        <Box
          width="100%"
          background="#FFFFFFFF"
          borderRadius="8px"
          marginTop="8px"
          position="absolute"
          zIndex={10}
          boxShadow="md"
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestions.map((suggestion, index) => (
            <Link
              key={`${suggestion.text}-${index}`}
              onClick={() => {
                setSearchTerm(suggestion.text);
                onSearch?.(suggestion.text);
                setSearchFocused(false);
              }}
              display="block"
              width="100%"
              padding="8px 12px"
              borderRadius="8px"
              _hover={{
                bg: "#00000011",
                textDecoration: "none",
              }}
              cursor="pointer"
            >
              <Text fontSize="sm">{suggestion.text}</Text>
              <Text fontSize="xs" color="#999">{suggestion.source.replace('_', ' ')}</Text>
            </Link>
          ))}
        </Box>
      )}

      <FilterMenu
        isOpen={filterFocused}
        onClose={() => setFilterFocused(false)}
        onFilterSelect={applyFilter}
      />
    </Box>
  );
};
