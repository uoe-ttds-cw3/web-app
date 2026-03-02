import { Box, Button, Text } from "@chakra-ui/react";

export type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const PaginationControls = ({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap="2"
      paddingY="6"
      marginTop="6"
    >
      <Button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        size="sm"
        variant="outline"
        colorScheme="green"
      >
        Previous
      </Button>
      <Box display="flex" gap="1" alignItems="center">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          const showPage =
            pageNum <= 3 ||
            pageNum >= totalPages - 2 ||
            Math.abs(pageNum - page) <= 2;

          if (!showPage) {
            if (
              (pageNum === 4 && page > 6) ||
              (pageNum === totalPages - 3 && page < totalPages - 5)
            ) {
              return (
                <Text key={pageNum} color="ui.textMuted" px="1">
                  ...
                </Text>
              );
            }
            return null;
          }

          return (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              size="sm"
              variant={pageNum === page ? "solid" : "ghost"}
              colorScheme="green"
              bg={pageNum === page ? "brand.primary" : undefined}
              color={pageNum === page ? "white" : "brand.primary"}
              minW="8"
            >
              {pageNum}
            </Button>
          );
        })}
      </Box>
      <Button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        size="sm"
        variant="outline"
        colorScheme="green"
      >
        Next
      </Button>
      <Text color="ui.textMuted" fontSize="sm" ml="4">
        Page {page} of {totalPages}
      </Text>
    </Box>
  );
};
