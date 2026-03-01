import { Box } from "@chakra-ui/react";
import { ShowControl } from "./ShowControl";
import { SortControl } from "./SortControl";

export type ResultsControlsProps = {
  sortBy?: string;
  pageSize: number;
  onSortChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
};

export const ResultsControls = ({
  sortBy,
  pageSize,
  onSortChange,
  onPageSizeChange,
}: ResultsControlsProps) => {
  return (
    <Box
      display="flex"
      alignItems={{ base: "stretch", md: "center" }}
      gap="3"
      flexWrap="wrap"
      width="auto"
      marginLeft={{ base: "0", md: "auto" }}
    >
      <Box display="flex" alignItems="center" gap="3" flexWrap="wrap">
        <SortControl sortBy={sortBy} onSortChange={onSortChange} />
        <ShowControl
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
      </Box>
    </Box>
  );
};
