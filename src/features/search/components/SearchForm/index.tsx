import { Input, InputGroup } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

export const SearchForm = () => {
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
