import { Box, Input, Button } from "@chakra-ui/react";
import { FaXmark } from "react-icons/fa6";

interface SearchTagsProps {
  filterType: string;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export const SearchTags = ({ filterType, value, onChange, onRemove }: SearchTagsProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      background="#9CCA9F"
      borderRadius="4px"
    >
      <Box
        background="#6EAF72"
        fontSize="10px"
        fontWeight="600"
        color="black"
        whiteSpace="nowrap"
        padding="5px 6px"
        display="flex"
        alignItems="center"
        borderRadius="4px"
      >
        {filterType}
      </Box>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="value"
        border="none"
        background="transparent"
        fontSize="10px"
        padding="2px 6px"
        height="auto"
        minWidth="50px"
        width={value ? `${Math.max(50, value.length * 6)}px` : "50px"}
        _focus={{
          outline: "none",
          boxShadow: "none",
        }}
        _placeholder={{
          color: "#00000066",
        }}
      />

      <Button
        onClick={onRemove}
        background="transparent"
        border="none"
        cursor="pointer"
        padding="0 2px"
        minWidth="auto"
        height="18px"
        display="flex"
        alignItems="center"
        scale='0.6'
      >
        <FaXmark color="black" />
      </Button>
    </Box>
  );
};
