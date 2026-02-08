import { Input, InputGroup, Box, Text, Link } from "@chakra-ui/react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

function applyFilter(filter: String){
  //do something
}

export const SearchForm = () => {
  const categories = ["A", "B"]; // probs come from a fetch

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [searchFocused, setSearchFocused] = useState(false);
  const filters = ["Product Code", "Device Class", "Panel Code"];

  // using react hook form
  // in onValid callback func
  // construct request to include search term and selected category

  return (
    <Box position="relative" width="100%">
      <InputGroup
        startElement={<FaSearch color="#4CAF50" style={{ marginLeft: "16px" }} />}
        backgroundColor="#FFFFFFFF"
        borderRadius="8px"
      >
        <Input
          borderRadius="8px"
          colorPalette="green"
          placeholder="Search by manufacturer, material, recall event"
          border="none"
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        ></Input>
      </InputGroup>

      {(searchFocused) && (
          <Box
            width="100%"
            background="#FFFFFFFF"
            borderRadius="8px"
            marginTop="8px"
            padding="16px"
            position="absolute"
            zIndex={10}
            colorPalette="green"
            onMouseDown={(e) => e.preventDefault()}
         
          >
            {filters.map(x => (
              <Text>Search <Link href="#" onClick={() => applyFilter(x)}><u>{x}</u></Link> for: {searchTerm}</Text>
            ))}
          </Box>
        )}
      </Box>
  );
};
