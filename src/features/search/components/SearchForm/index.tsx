import { Input, InputGroup, Box, Text, Link } from "@chakra-ui/react";
import { SetStateAction, useState } from "react";
import { FaSearch } from "react-icons/fa";

export const SearchForm = () => {
  const categories = ["A", "B"]; // probs come from a fetch

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [searchFocused, setSearchFocused] = useState(false);
  const autofillResults = ["option 1", "option 2", "option 3"];

  function applyAutofill(fill: String){
  }

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
            position="absolute"
            zIndex={10}
            colorPalette="green"
            onMouseDown={(e) => e.preventDefault()}
         
          >
            {autofillResults.map((x, index) => (
              <Link
                key={index}
                onClick={() => applyAutofill(x)}
                display="block"
                width="100%"
                padding="8px 12px"
                borderRadius="8px"
                _hover={{ 
                  bg: "#00000011",
                }}
                cursor="pointer"
              >
                <Text>{x}</Text>
              </Link>
            ))}
          </Box>
        )}
      </Box>
  );
};
