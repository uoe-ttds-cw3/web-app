import { Box, Grid, Link, Text, Flex, Checkbox } from "@chakra-ui/react";
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
  selectedDevices: Device[];
  onToggle: (device: Device) => void;
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
  device, selectedDevices, onToggle
}: DeviceSummaryCardProps) => {
  
  const isSelected = selectedDevices.some(d => d.id === device.id);

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
          <Link color="#266429" href={`/devices/${device.id}`}><u><b>{device.name}</b></u></Link>
          <Text>Manufacturer: <Box as="span" color="black">{device.manufacturer}</Box></Text>
          <Text>Date cleared: <Box as="span" color="black">{device.date}</Box></Text>
          <Text>Panel: <Box as="span" color="black">{device.panel}</Box></Text>
          {device.deviceClass && (
            <Text>Class: <Box as="span" color="black">Class {device.deviceClass}</Box></Text>
          )}
          <Text>Product Code: <Box as="span" color="black">{device.pCode}</Box></Text>
          <Text>Number of recalls: <Box as="span" color="black">{device.recalls}</Box></Text>
          {device.snippet && (
            <Text
              fontSize="sm"
              color="gray.600"
              marginTop="8px"
              overflowWrap="anywhere"
            >
              {device.snippet}
            </Text>
          )}
        </Box>
        <Box display="flex" flexDirection="column" height="100%">
        
          <Checkbox.Root p={4} colorPalette={"#4CAF5020"} variant={"subtle"} checked={isSelected} onCheckedChange={() => onToggle(device)}>
              <Checkbox.HiddenInput />
              <Checkbox.Label>Add to comparison</Checkbox.Label>
              <Checkbox.Control />
            </Checkbox.Root>
        
        </Box>
      </Grid>
    </Box>
  );
};
