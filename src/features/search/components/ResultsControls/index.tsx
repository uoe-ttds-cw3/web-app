import { Box } from "@chakra-ui/react";
import type { FacetField } from "@/lib/api/types";
import { FilterControl } from "./FilterControl";
import { ShowControl } from "./ShowControl";
import { SortControl } from "./SortControl";

export type ResultsControlsProps = {
  sortBy?: string;
  pageSize: number;
  filterOpen: boolean;
  facets: FacetField[] | null;
  onSortChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
  onFilterToggle: () => void;
  onFilterClose: () => void;
  onFacetFilter: (field: string, value: string) => void;
};

export const ResultsControls = ({
  sortBy,
  pageSize,
  filterOpen,
  facets,
  onSortChange,
  onPageSizeChange,
  onFilterToggle,
  onFilterClose,
  onFacetFilter,
}: ResultsControlsProps) => {
  return (
    <Box
      display="flex"
      alignItems={{ base: "stretch", md: "center" }}
      justifyContent="space-between"
      gap="3"
      flexWrap="wrap"
      width="100%"
    >
      <Box display="flex" alignItems="center" gap="3" flexWrap="wrap">
        <SortControl sortBy={sortBy} onSortChange={onSortChange} />
        <ShowControl
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
      </Box>
      <FilterControl
        filterOpen={filterOpen}
        facets={facets}
        onFilterToggle={onFilterToggle}
        onFilterClose={onFilterClose}
        onFacetFilter={onFacetFilter}
      />
    </Box>
  );
};
