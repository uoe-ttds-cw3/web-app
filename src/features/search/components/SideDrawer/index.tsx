import { useEffect, useState } from "react";
import { Button, CloseButton, Drawer, Kbd, Portal, Table, HStack, Text, Box, Stack, type StackProps } from "@chakra-ui/react";
import type { DeviceLookupResponse, LineageResponse, SafetyProfileResponse } from "@/lib/api/types";
import { forwardRef, useRef } from "react"
import React from "react";
import { MdCompare, MdClose } from "react-icons/md";

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
        bottom="20px"
        right="0"
        w="80px"
        h="80px"
        backgroundColor="whiteAlpha.700"
        padding="2px"
        borderLeft="1px solid"
        borderTopLeftRadius="80px"
        borderBottomLeftRadius="80px"
        borderColor="gray.200"
        shadow="md"
        zIndex="1000"
        alignItems="center"
        justifyContent="center"
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

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  return (
    <HStack>
      <Drawer.Root size="md">
        <Box position="fixed" top="0" left="0" w="100%" h="100%" zIndex={999} alignItems="center" justifyContent="center" pointerEvents="none">
          <DrawerContainer position="absolute" right="0" ref={portalRef} pointerEvents="auto">
            <Drawer.Trigger asChild>
              <Button
                variant="ghost"
                size="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="green.700"
                fontSize="xl"
                title="Open Comparison"
              >
                <MdCompare />
              </Button>
            </Drawer.Trigger> 
          </DrawerContainer>
        </Box>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content maxW="85vw" maxH="85vh" m="auto" borderRadius="12px" p="4">
              <Box display="flex" justifyContent="space-between" alignItems="center" p="4" borderBottomWidth="1px">
                <Drawer.Title fontSize="lg" color="brand.primary" fontWeight="bold">Device Comparison</Drawer.Title>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Box>
              <Drawer.Body overflow="auto">
                {loading ? (
                  <Text>Loading...</Text>
                ) : (
                  <Table.ScrollArea borderWidth="1px">
                  <Table.Root size="sm" interactive>
                    <Table.Header>
                      <Table.Row minH="400px">
                        <Table.ColumnHeader p={4}></Table.ColumnHeader>
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
                            <Table.Cell p={4}>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => handleRemoveRow(index)}
                                title="Remove from comparison"
                              >
                                <MdClose />
                              </Button>
                            </Table.Cell>
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
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </HStack>
  );
};