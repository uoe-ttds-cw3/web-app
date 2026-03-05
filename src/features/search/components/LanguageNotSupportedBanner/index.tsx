import { Alert, Box, Text } from "@chakra-ui/react";

export const LanguageNotSupportedBanner = () => {
  return (
    <Alert.Root
      status="warning"
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
          Query language not supported
        </Alert.Title>
        <Text fontSize={{ base: "md", md: "lg" }} mt="2">
          Please search in English. Our medical device records are indexed in
          English, so non-English queries may not return reliable results.
        </Text>
      </Box>
    </Alert.Root>
  );
};
