import { Box, Card, Heading } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type DeviceDetailCardProps = {
  title?: string;
  children: ReactNode;
};

export const DeviceDetailCard = ({
  title,
  children,
}: DeviceDetailCardProps) => {
  return (
    <Card.Root
      backgroundColor="white"
      padding={{ base: "16px", md: "24px" }}
      borderRadius="12px"
      maxWidth="1200px"
      borderWidth="1px"
      borderColor="ui.border"
    >
      {title && (
        <Heading size="lg" color="brand.primary" marginBottom="4px">
          {title}
        </Heading>
      )}
      <Box>{children}</Box>
    </Card.Root>
  );
};
