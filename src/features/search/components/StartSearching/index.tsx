import { Center, Icon, VStack, Text } from "@chakra-ui/react";
import { PiStethoscopeDuotone } from "react-icons/pi";

export const StartSearching = () => {
  return (
    <Center padding="1rem">
      <VStack spaceY={-1.5}>
        <Icon as={PiStethoscopeDuotone} fontSize="120px" color="#D9D9D9" />
        <Text fontSize="lg" fontWeight="bold" color="#4CAF50DB">
          Start Searching!
        </Text>
        <Text fontSize="lg" color="#4CAF50DB">
          Maybe try &apos;insulin pump&apos;
        </Text>
      </VStack>
    </Center>
  );
};
