import { Box, Card, Heading } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const DEVICE_DETAIL_MAX_W = "1000px";

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
      width="100%"
      padding={{ base: "16px", md: "24px" }}
      borderRadius="12px"
      maxWidth={DEVICE_DETAIL_MAX_W}
      marginX="auto"
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
