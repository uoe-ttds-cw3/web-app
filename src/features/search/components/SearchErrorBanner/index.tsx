import { Alert, Box, Text } from "@chakra-ui/react";

export const SearchErrorBanner = () => {
  return (
    <Alert.Root
      status="error"
      px={{ base: "5", md: "7" }}
      py={{ base: "5", md: "6" }}
      borderRadius="xl"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="2"
    >
      <Alert.Indicator />
      <Box textAlign="center">
        <Alert.Title fontSize={{ base: "lg", md: "xl" }}>
          Whoops, something went wrong!
        </Alert.Title>
        <Text fontSize={{ base: "md", md: "lg" }} mt="2">
          Please try again or try a different query. You can also pick one of
          the search terms below.
        </Text>
      </Box>
    </Alert.Root>
  );
};
