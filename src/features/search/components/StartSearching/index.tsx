import { Center, Icon, VStack, Text, Box } from "@chakra-ui/react";
import { PiStethoscopeDuotone } from "react-icons/pi";

interface StartSearchingProps {
  onSuggest?: (query: string) => void;
}

export const StartSearching = ({ onSuggest }: StartSearchingProps) => {
  return (
    <Center padding="1rem">
      <VStack spaceY={-1.5}>
        <Icon as={PiStethoscopeDuotone} fontSize="120px" color="#D9D9D9" />
        <Text fontSize="lg" fontWeight="bold" color="#266429" mb="2">
          Start Searching!
        </Text>
        <Text fontSize="md" color="#666" mb="3">
          Try searching for:
        </Text>
        <Box display="flex" gap="8px" justifyContent="center" flexWrap="wrap">
          {["insulin pump", "pacemaker", "catheter"].map((suggestion) => (
            <Box
              key={suggestion}
              as="button"
              onClick={() => onSuggest?.(suggestion)}
              marginTop="10px"
              padding="6px 16px"
              borderRadius="20px"
              backgroundColor="#4CAF5020"
              color="#266429"
              fontSize="sm"
              cursor="pointer"
              _hover={{ backgroundColor: "#4CAF5040" }}
            >
              {suggestion}
            </Box>
          ))}
        </Box>
      </VStack>
    </Center>
  );
};
