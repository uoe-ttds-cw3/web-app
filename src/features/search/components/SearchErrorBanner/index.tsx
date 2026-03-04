import { Alert, Box, Button, Text } from "@chakra-ui/react";

type SearchErrorBannerProps = {
  onRetry: () => void;
};

export const SearchErrorBanner = ({ onRetry }: SearchErrorBannerProps) => {
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
          Pick one of the search terms below, or
        </Text>
        <Button p="4" variant="subtle" mt="4" size="md" onClick={onRetry}>
          Click here to try this search again
        </Button>
      </Box>
    </Alert.Root>
  );
};
