import {
  Button,
  CloseButton,
  Drawer,
  Kbd,
  Portal,
  Table,
  HStack,
  Text,
  Box,
  Stack,
  type StackProps,
  Badge,
} from "@chakra-ui/react";
import type {
  Device,
  DeviceLookupResponse,
  LineageResponse,
  SafetyProfileResponse,
} from "@/lib/api/types";
import { forwardRef, useRef } from "react";
import React from "react";
import { MdCompare, MdClose } from "react-icons/md";
import { useQueries } from "@tanstack/react-query";
import useLocalStorage from "use-local-storage";

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
  },
);

export function formatCell(
  value: string | string[] | number | undefined | null,
  charLimit = 50,
): React.ReactNode {
  if (value == null) return "-";

  if (Array.isArray(value)) {
    if (value.length === 0) return "-";
    const truncated =
      value.slice(0, 3).join(", ") + (value.length > 3 ? ", ..." : "");
    return truncated;
  }

  if (typeof value === "string") {
    if (value.length <= charLimit) return value;
    return value.slice(0, charLimit) + "...";
  }

  if (typeof value === "number") return value;
  return "-";
}

function useDevices(selectedDevices: Device[]) {
  console.log("useDevices called");
  const selectedDeviceIds = selectedDevices.map(({ id }) => id);

  const queryResults = useQueries({
    queries: selectedDeviceIds.map((id) => ({
      queryKey: ["device", id],
      queryFn: async () => {
        console.log("fetching", id);
        const res = await fetch(`/api/device/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch device ${id}`);
        }
        return res.json();
      },
      enabled: Boolean(id),
    })),
  });

  const rows = queryResults.map((q) => q.data).filter(Boolean);
  const isLoading = queryResults.some((q) => q.isLoading);
  const isError = queryResults.some((q) => q.isError);
  const error = queryResults.find((q) => q.error)?.error;

  return { rows, isLoading, isError, error };
}

export const SideDrawer = () => {
  const portalRef = useRef<HTMLDivElement | null>(null);

  const [selectedDevices, setSelectedDevices] = useLocalStorage<Device[]>(
    "selectedDevices",
    [],
  );

  const { rows, isLoading: loading } = useDevices(selectedDevices);

  const handleRemoveRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setSelectedDevices(updatedRows as Device[]);
  };

  return (
    <HStack>
      <Drawer.Root size="md">
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100%"
          h="100%"
          zIndex={999}
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
        >
          <DrawerContainer
            position="absolute"
            right="0"
            ref={portalRef}
            pointerEvents="auto"
          >
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
                {selectedDevices.length > 0 && (
                  <Badge colorPalette="green"> {selectedDevices.length} </Badge>
                )}
              </Button>
            </Drawer.Trigger>
          </DrawerContainer>
        </Box>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content
              maxW="85vw"
              maxH="85vh"
              m="auto"
              borderRadius="12px"
              p="4"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p="4"
                borderBottomWidth="1px"
              >
                <Drawer.Title
                  fontSize="lg"
                  color="brand.primary"
                  fontWeight="bold"
                >
                  Device Comparison
                </Drawer.Title>
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
                          <Table.ColumnHeader p={4}>
                            Product Code
                          </Table.ColumnHeader>
                          <Table.ColumnHeader p={4}>
                            Manufacturer
                          </Table.ColumnHeader>
                          <Table.ColumnHeader p={4}>
                            Direct Predicates
                          </Table.ColumnHeader>
                          <Table.ColumnHeader p={4}>
                            Ancestors
                          </Table.ColumnHeader>
                          <Table.ColumnHeader p={4}>
                            Number of Ancestors
                          </Table.ColumnHeader>
                          <Table.ColumnHeader p={4}>
                            Descendants
                          </Table.ColumnHeader>
                          <Table.ColumnHeader p={4}>
                            Decision Date
                          </Table.ColumnHeader>
                          <Table.ColumnHeader p={4} textAlign="end">
                            Number of Recalls
                          </Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        {rows.map((row, index) => {
                          const { device, lineage, safety } = row;
                          if (!device) return null;

                          return (
                            <Table.Row
                              minH="400px"
                              key={device.submission_number}
                            >
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
                              <Table.Cell p={4}>
                                {formatCell(device.device_name)}
                              </Table.Cell>
                              <Table.Cell p={4}>
                                {device.product_code}
                              </Table.Cell>
                              <Table.Cell p={4}>
                                {formatCell(device.sponsor)}
                              </Table.Cell>
                              <Table.Cell p={4}>
                                {formatCell(lineage?.direct_predicates)}
                              </Table.Cell>
                              <Table.Cell p={4}>
                                {formatCell(lineage?.ancestors)}
                              </Table.Cell>
                              <Table.Cell p={4}>
                                {formatCell(lineage?.ancestor_count)}
                              </Table.Cell>
                              <Table.Cell p={4}>
                                {formatCell(lineage?.descendants)}
                              </Table.Cell>
                              <Table.Cell p={4}>
                                {device.decision_date}
                              </Table.Cell>
                              <Table.Cell p={4} textAlign="end">
                                {safety?.recall_count}
                              </Table.Cell>
                            </Table.Row>
                          );
                        })}
                      </Table.Body>
                    </Table.Root>
                  </Table.ScrollArea>
                )}
                <Text mt={2}>
                  Press the <Kbd>esc</Kbd> key to close the comparison.
                </Text>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </HStack>
  );
};
