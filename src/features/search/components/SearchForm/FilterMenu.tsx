import { Box, Button, Icon, Input, Text } from "@chakra-ui/react";
import { type ElementType, useRef } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoCalendarNumber } from "react-icons/io5";
import { MdNumbers } from "react-icons/md";

export type QuickFilters = {
  submissionNumber: string;
  dateAfter: string;
  dateBefore: string;
};

interface FilterMenuProps {
  isOpen: boolean;
  values: QuickFilters;
  onChange: (field: keyof QuickFilters, value: string) => void;
  onApply: () => void;
}

const FILTER_FIELDS: Array<{
  key: keyof QuickFilters;
  label: string;
  placeholder: string;
  icon: ElementType;
}> = [
  {
    key: "submissionNumber",
    label: "Submission Number",
    placeholder: "By Submission No.",
    icon: MdNumbers,
  },
  {
    key: "dateAfter",
    label: "Cleared After Date",
    placeholder: "",
    icon: IoCalendarNumber,
  },
  {
    key: "dateBefore",
    label: "Cleared Before Date",
    placeholder: "",
    icon: IoCalendarNumber,
  },
];

const DATE_FIELDS: Array<keyof QuickFilters> = ["dateAfter", "dateBefore"];

const QuickFilterTextInput = ({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => (
  <Box
    display="flex"
    alignItems="center"
    backgroundColor="ui.background"
    borderRadius="8px"
    paddingX="12px"
    height="44px"
    border="1px solid"
    borderColor="ui.borderLight"
    _focusWithin={{
      borderColor: "brand.primary",
      boxShadow: "0 0 0 1px var(--chakra-colors-brand-primary)",
    }}
  >
    <Input
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      placeholder={placeholder}
      border="none"
      padding="0"
      height="100%"
      fontSize="sm"
      background="transparent"
      _focus={{ boxShadow: "none", outline: "none" }}
    />
  </Box>
);

const QuickFilterDateInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="8px"
      backgroundColor="ui.background"
      borderRadius="8px"
      paddingX="12px"
      height="44px"
      border="1px solid"
      borderColor="ui.borderLight"
      cursor="pointer"
      onClick={() => {
        inputRef.current?.showPicker?.();
        inputRef.current?.focus();
      }}
    >
      <Icon
        as={FaRegCalendarAlt}
        color="brand.primary"
        boxSize="4"
        flexShrink={0}
      />
      <Input
        ref={inputRef}
        type="date"
        value={value}
        max={today}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        border="none"
        padding="0"
        height="100%"
        fontSize="sm"
        background="transparent"
        _focus={{ boxShadow: "none", outline: "none" }}
        css={{
          "&::-webkit-calendar-picker-indicator": {
            opacity: 0,
            display: "none",
            pointerEvents: "none",
          },
          "&::-webkit-clear-button": {
            display: "none",
          },
        }}
      />
    </Box>
  );
};

export const FilterMenu = ({
  isOpen,
  values,
  onChange,
  onApply,
}: FilterMenuProps) => {
  if (!isOpen) return null;

  return (
    <Box
      width={{ base: "300px", md: "320px" }}
      background="ui.background"
      borderRadius="12px"
      marginTop="8px"
      padding="16px"
      position="absolute"
      right="0"
      zIndex={10}
      border="1px solid"
      borderColor="ui.borderLight"
      boxShadow="lg"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Text fontSize="2xl" fontWeight="semibold" color="brand.primary" mb="4">
        Quick Filters
      </Text>

      <Box display="flex" flexDirection="column" gap="4">
        {FILTER_FIELDS.map((field) => (
          <Box key={field.key}>
            <Box
              display="flex"
              alignItems="center"
              gap="2"
              marginBottom="2"
              color="ui.text"
            >
              <Icon
                as={field.icon}
                boxSize="4"
                color="brand.primary"
                flexShrink={0}
              />
              <Text fontSize="sm" fontWeight="semibold">
                {field.label}
              </Text>
            </Box>
            {DATE_FIELDS.includes(field.key) ? (
              <QuickFilterDateInput
                value={values[field.key]}
                onChange={(value) => onChange(field.key, value)}
              />
            ) : (
              <QuickFilterTextInput
                value={values[field.key]}
                placeholder={field.placeholder}
                onChange={(value) => onChange(field.key, value)}
              />
            )}
          </Box>
        ))}

        <Button
          type="button"
          onClick={onApply}
          width="100%"
          height="44px"
          borderRadius="8px"
          backgroundColor="brand.primary"
          color="white"
          fontSize="sm"
          fontWeight="semibold"
          _hover={{ opacity: 0.9 }}
          _active={{ opacity: 0.9 }}
        >
          Apply filters
        </Button>
      </Box>
    </Box>
  );
};
