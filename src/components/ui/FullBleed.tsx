import { Box, BoxProps } from "@chakra-ui/react";

type FullBleedProps = BoxProps;

// From https://www.joshwcomeau.com/css/full-bleed/

export function FullBleed({ children, ...props }: FullBleedProps) {
  return (
    <Box
      width="100vw"
      position="relative"
      left="50%"
      right="50%"
      marginLeft="-50vw"
      marginRight="-50vw"
      {...props}
    >
      {children}
    </Box>
  );
}
