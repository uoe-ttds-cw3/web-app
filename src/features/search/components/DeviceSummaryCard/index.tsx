import { Box, Grid, Link, Text, Flex } from "@chakra-ui/react";
import { useState } from "react";

export type Device = {
  id: string;           // submission_number
  name: string;         // device_name
  manufacturer: string; // sponsor
  date: string;         // decision_date
  panel: string;        // panel name
  pCode: string;        // product_code
  recalls: number;      // default 0 (populated later by safety data)
  availability: boolean; // default true
  snippet: string;      // search result snippet
  relevanceScore: number;
  deviceClass: string | null;
  pagerankScore: number | null;
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
  device: { id, name, manufacturer, date, panel, pCode, recalls, deviceClass, snippet },
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
          <Text>Manufacturer: <Box as="span" color="black">{manufacturer}</Box></Text>
          <Text>Date cleared: <Box as="span" color="black">{date}</Box></Text>
          <Text>Panel: <Box as="span" color="black">{panel}</Box></Text>
          {deviceClass && (
            <Text>Class: <Box as="span" color="black">Class {deviceClass}</Box></Text>
          )}
          <Text>Product Code: <Box as="span" color="black">{pCode}</Box></Text>
          <Text>Number of recalls: <Box as="span" color="black">{recalls}</Box></Text>
          {snippet && (
            <Text fontSize="sm" color="gray.600" marginTop="8px">
              {snippet}
            </Text>
          )}
        </Box>
        <Box display="flex" flexDirection="column" height="100%">
          < ToggleCompared />
        </Box>
      </Grid>
    </Box>
  );
};
