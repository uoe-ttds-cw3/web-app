import { Box, Input, Button } from "@chakra-ui/react";
import { FaXmark } from "react-icons/fa6";
import { useState } from "react";

interface SearchTagsProps {
  filterType: string;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  onEnter?: () => void;
}

const isDateFilter = (filterType: string) => {
  return filterType === "Before" || filterType === "After";
};

const formatDateFromInput = (input: string): string => {
  const digits = input.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

export const SearchTags = ({ filterType, value, onChange, onRemove, onEnter }: SearchTagsProps) => {
  const isDate = isDateFilter(filterType);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateFromInput(e.target.value);
    onChange(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEnter?.();
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      background="#9CCA9F"
      borderRadius="4px"
      position="relative"
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

      {isDate ? (
        <Input
          value={value}
          onChange={handleDateInputChange}
          onKeyDown={handleKeyDown}
          placeholder="DD/MM/YYYY"
          border="none"
          background="transparent"
          fontSize="10px"
          padding="2px 6px"
          height="auto"
          width={value ? `${Math.max(85, value.length * 6)}px` : "80px"}
          maxLength={10}
          _focus={{
            outline: "none",
            boxShadow: "none",
          }}
          _placeholder={{
            color: "#00000066",
          }}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="value"
          border="none"
          background="transparent"
          fontSize="10px"
          padding="2px 6px"
          height="auto"
          minWidth="55px"
          width={value ? `${Math.max(10, value.length * 4)}px` : "50px"}
          _focus={{
            outline: "none",
            boxShadow: "none",
          }}
          _placeholder={{
            color: "#00000066",
          }}
        />
      )}

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
        scale="0.6"
        marginLeft="-10px"
      >
        <FaXmark color="black" />
      </Button>
    </Box>
  );
};
