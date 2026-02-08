import { Box, Grid, Link, Text, Flex } from "@chakra-ui/react";
import { useState } from "react";

export type Device = {
  id: string;
  name: string;
  manufacturer: string;
  date: string;
  panel: string;
  pCode: string;
  recalls: number;
  availability: boolean;
  // TO ADD BASED ON WHETHER POSSIBLE: LOCATION, APPLICATION, MATERIALS
};

type DeviceSummaryCardProps = {
  device: Device;
};

function ToggleCompared() {
  //connect to comparison
  //maybe animate change
  //maybe use icons instead of text
  const [isCompared, setIsCompared] = useState(false);

  return (
    <Flex
      mt="auto"
      justify="flex-end"
      cursor="pointer"
      onClick={() => setIsCompared(!isCompared)}
    >
      <Text fontSize="32px">
        {isCompared ? "-" : "+"}
      </Text>
    </Flex>
  );
}

export const DeviceSummaryCard = ({
  device: { id, name, manufacturer, date, panel, pCode, recalls, availability },
}: DeviceSummaryCardProps) => {
  return (
    <Box
      backgroundColor="#D2D2D2"
      padding="16px"
      borderRadius="8px"
      color="#266429"
      marginBottom="16px"
    >
      <Grid color="#266429" gridTemplate="1fr / 4fr 1fr">
        <Box>
          <Link color="#266429" href={`/devices/${id}`}><u><b>{name}</b></u></Link>
          <Text>{manufacturer}</Text>
          <Text>Date cleared: {date}</Text>
          <Text>Panel: {panel}</Text>
          <Text>Product Code: {pCode}</Text>
          <Text>Number of recalls: {recalls}</Text>
          <Text>Available: {availability ? "Yes" : "No"} </Text>
        </Box>
        <Box display="flex" flexDirection="column" height="100%">
          <Text textAlign="right">
            <Link color="#266429" href="www.example.com"><u>Documentation</u>⧉</Link>
          </Text>
          <ToggleCompared />
        </Box>
      </Grid>
    </Box>
  );
};
