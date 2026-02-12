import { Box, BoxProps } from "@chakra-ui/react";

type PageLayoutProps = BoxProps & {
  maxW?: BoxProps["maxW"];
};

// wider responsive layout for medical device search
export function PageLayout({
  children,
  maxW = { base: "100%", md: "1200px" },
  ...props
}: PageLayoutProps) {
  return (
    <Box
      as="main"
      px={{ base: 4, md: 6, lg: 8 }}
      py={{ base: 10, md: 14 }}
      {...props}
    >
      <Box maxW={maxW} mx="auto">
        {children}
      </Box>
    </Box>
  );
}
