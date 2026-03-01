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
      <NativeSelect.Root size="sm" width="80px">
        <NativeSelect.Field
          value={String(pageSize)}
          onChange={(e) => onPageSizeChange(Number(e.currentTarget.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Box>
  );
};
