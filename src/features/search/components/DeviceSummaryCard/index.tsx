import { Box, Grid, Link, Text } from "@chakra-ui/react";

export type Device = {
  id: string;
  name: string;
  manufacturer: string;
  date: string;
  panel: string;
  recalls: number;
};

type DeviceSummaryCardProps = {
  device: Device;
};

export const DeviceSummaryCard = ({
  device: { id, name, manufacturer, date, panel, recalls },
}: DeviceSummaryCardProps) => {
  return (
    <Box
      backgroundColor="#D2D2D2"
      padding="16px"
      borderRadius="8px"
      color="#266429"
    >
      <Link display="block" href={`/devices/${id}`}>
        <Grid gridTemplate="1fr / 1fr 1fr">
          <Box>
            <Text>Name: {name}</Text>
            <Text>Manufacturer: {manufacturer}</Text>
            <Text>Date cleared: {date}</Text>
            <Text>Panel: {panel}</Text>
            <Text>Number of recalls: {recalls}</Text>
          </Box>
          <Box>
            <Text>
              {/* TODO */}
              {/* <Link href="www.example.com">Documentation</Link> */}
            </Text>
          </Box>
        </Grid>
      </Link>
    </Box>
  );
};
