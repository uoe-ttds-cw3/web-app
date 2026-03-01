import { Box, NativeSelect, Text } from "@chakra-ui/react";

export type ShowControlProps = {
  pageSize: number;
  onPageSizeChange: (value: number) => void;
};

export const ShowControl = ({
  pageSize,
  onPageSizeChange,
}: ShowControlProps) => {
  return (
    <Box display="flex" alignItems="center" gap="2">
      <Text fontSize="sm" color="ui.textMuted" whiteSpace="nowrap">
        Show:
      </Text>
      <NativeSelect.Root size="sm" width="72px">
        <NativeSelect.Field
          value={String(pageSize)}
          onChange={(e) => onPageSizeChange(Number(e.currentTarget.value))}
          bg="ui.surface"
          borderColor="ui.borderLight"
          borderRadius="8px"
          fontSize="sm"
          fontWeight="600"
          color="ui.text"
          height="36px"
          paddingLeft="12px"
          paddingRight="28px"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator color="ui.textMuted" />
      </NativeSelect.Root>
    </Box>
  );
};
