import { Box, NativeSelect, Text } from "@chakra-ui/react";
import { useId } from "react";

export type SortControlProps = {
  sortBy?: string;
  onSortChange: (value: string) => void;
};

export const SortControl = ({ sortBy, onSortChange }: SortControlProps) => {
  const selectId = useId();

  return (
    <Box display="flex" alignItems="center" gap="2">
      <Text as="label" fontSize="sm" color="ui.textMuted" whiteSpace="nowrap">
        Sort:
      </Text>
      <NativeSelect.Root size="sm" width={{ base: "148px", md: "172px" }}>
        <NativeSelect.Field
          id={selectId}
          value={sortBy || ""}
          onChange={(e) => onSortChange(e.currentTarget.value)}
          bg="ui.surface"
          borderColor="ui.borderLight"
          borderRadius="8px"
          fontSize="sm"
          fontWeight="600"
          color="ui.text"
          height="36px"
          paddingLeft="12px"
          paddingRight="32px"
        >
          <option value="">Relevance</option>
          <option value="decision_date_desc">Newest Approved</option>
          <option value="decision_date_asc">Oldest Approved</option>
          <option value="date_received_desc">Newest Submitted</option>
          <option value="date_received_asc">Oldest Submitted</option>
          <option value="manufacturer_asc">Manufacturer A-Z</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator color="ui.textMuted" />
      </NativeSelect.Root>
    </Box>
  );
};
