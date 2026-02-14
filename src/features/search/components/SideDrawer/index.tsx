import { useEffect, useState } from "react";
import { Tooltip, Button, CloseButton, Drawer, Kbd, Portal, Table, HStack, Text, Box, Stack, type StackProps } from "@chakra-ui/react";
import type { DeviceLookupResponse, LineageResponse, SafetyProfileResponse } from "@/lib/api/types";
import { forwardRef, useRef } from "react"
import React from "react";

interface SideDrawerProps {
  selectedDeviceIds: string[];
}

interface DevicePageData {
  device: DeviceLookupResponse | null;
  lineage: LineageResponse | null;
  safety: SafetyProfileResponse | null;
}

const DrawerContainer = forwardRef<HTMLDivElement, StackProps>(
  function DrawerContainer(props, ref) {
    return (
      <Stack
        position="fixed"
        top="0"
        right="0"
        bottom="0"
        w="40px" // width of sidebar strip — adjust
        backgroundColor="whiteAlpha.700"
        padding="2px"
        borderLeft="1px solid"
        borderColor="gray.200"
        shadow="md"
        zIndex="1000"
        ref={ref}
        {...props}
      />
    );
  }
);

export function formatCell(
  value: string | string[] | number | undefined | null, charLimit = 50
): React.ReactNode {
  if (value == null) return "-";

  if (Array.isArray(value)) {
    if (value.length === 0) return "-";
    const truncated = value.slice(0, 3).join(", ") + (value.length > 3 ? ", ..." : "");
    return truncated;
  }

  if (typeof value === "string") {
    if (value.length <= charLimit) return value;
    return value.slice(0, charLimit) + "...";
  }

  if (typeof value === "number") return value;
  return "-";
}


export const SideDrawer = ({ selectedDeviceIds }: SideDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<DevicePageData[]>([]);
  const portalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (selectedDeviceIds.length === 0 && <Text>Select devices to compare.</Text>) {
      setRows([]);
      return;
    }

    async function fetchData() {
      setLoading(true);

      try {
        const data = await Promise.all(
          selectedDeviceIds.map(id =>
            fetch(`/api/device/${id}`).then(res => res.json())
          )
        );

        // Each item has { device, lineage, safety }
        setRows(data);
      } catch (err) {
        console.error("Error fetching device data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedDeviceIds]);

  return (
    <HStack>
      <Drawer.Root size="full">
        <Box position="fixed" top="0" left="0" w="100%" h="100%" zIndex={999} alignItems="center" justifyContent="center" pointerEvents="none">
          <DrawerContainer position="absolute" right="0" ref={portalRef} pointerEvents="auto">
            <Drawer.Trigger  asChild>
            <Button
                variant="ghost"
                size="sm"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                top="50%"
                position="absolute"
                transform="translateY(-50%)"
                height="100px"
                
              >
                {"Open Comparison".split("").map((char, i) => (
                  <Box key={i} lineHeight="1" fontSize="sm">
                    {char}
                  </Box>
                ))}
              </Button>
            </Drawer.Trigger> 
          </DrawerContainer>
        </Box>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
            <Box backgroundColor="whiteAlpha.700" padding="16px" borderRadius="8px" color="#266429" marginBottom="16px">
              <Drawer.Header>
                <Drawer.Title>Device Comparison</Drawer.Title>
              </Drawer.Header>
              </Box>
              <Box backgroundColor="whiteAlpha.700" padding="16px" borderRadius="8px" color="#266429" marginBottom="16px"> 
              <Drawer.Body overflow="auto">
                {loading ? (
                  <Text>Loading...</Text>
                ) : (
                  <Table.ScrollArea borderWidth="1px">
                  <Table.Root size="sm" interactive>
                    <Table.Header>
                      <Table.Row minH="400px">
                        <Table.ColumnHeader p={4}>Name</Table.ColumnHeader>
                        <Table.ColumnHeader p={4}>Product Code</Table.ColumnHeader>
                        <Table.ColumnHeader p={4}>Manufacturer</Table.ColumnHeader>
                        <Table.ColumnHeader p={4}>Direct Predicates</Table.ColumnHeader>
                        <Table.ColumnHeader p={4}>Ancestors</Table.ColumnHeader>
                        <Table.ColumnHeader p={4}>Number of Ancestors</Table.ColumnHeader>
                        <Table.ColumnHeader p={4}>Descendants</Table.ColumnHeader>
                        <Table.ColumnHeader p={4}>Decision Date</Table.ColumnHeader>
                        <Table.ColumnHeader p={4} textAlign="end">Number of Recalls</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {rows.map((row, index) => {
                        const { device, lineage, safety } = row;
                        if (!device) return null;

                        return (
                          <Table.Row minH="400px" key={device.submission_number}>
                            <Table.Cell p={4}>{formatCell(device.device_name)}</Table.Cell>
                            <Table.Cell p={4}>{device.product_code}</Table.Cell>
                            <Table.Cell p={4}>{formatCell(device.sponsor)}</Table.Cell>
                            <Table.Cell p={4}>{formatCell(lineage?.direct_predicates)}</Table.Cell>
                            <Table.Cell p={4}>{formatCell(lineage?.ancestors)}</Table.Cell>
                            <Table.Cell p={4}>{formatCell(lineage?.ancestor_count)}</Table.Cell>
                            <Table.Cell p={4}>{formatCell(lineage?.descendants)}</Table.Cell>
                            <Table.Cell p={4}>{device.decision_date}</Table.Cell>
                            <Table.Cell p={4} textAlign="end">{safety?.recall_count}</Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                  </Table.ScrollArea>
                )}
                <Text mt={2}>Press the <Kbd>esc</Kbd> key to close the comparison.</Text>
              </Drawer.Body></Box>

              <Drawer.Footer paddingRight={4}>
                <Drawer.ActionTrigger asChild>
                  <Button p={4} variant="outline">Cancel</Button>
                </Drawer.ActionTrigger>
                <Button p={4} >Save</Button>
              </Drawer.Footer>

              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </HStack>
  );
};