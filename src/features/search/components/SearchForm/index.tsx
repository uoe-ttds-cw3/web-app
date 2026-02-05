import { Input, InputGroup } from "@chakra-ui/react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export const SearchForm = () => {
  const categories = ["A", "B"]; // probs come from a fetch

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // using react hook form
  // in onValid callback func
  // construct request to include search term and selected category

  return (
    <InputGroup
      startElement={<FaSearch color="#4CAF50" style={{ marginLeft: "16px" }} />}
    >
      <Input
        colorPalette="green"
        placeholder="Search by manufacturer, material, recall event"
      ></Input>
    </InputGroup>
  );
};
