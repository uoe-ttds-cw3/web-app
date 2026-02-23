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
import posthog from "posthog-js";
import type { Device } from "@/lib/api/types";
import { forwardRef, useRef, useSyncExternalStore } from "react";
import React from "react";
import { MdCompare, MdClose } from "react-icons/md";
import useLocalStorage from "use-local-storage";

const subscribe = () => () => {};

const DrawerContainer = forwardRef<HTMLDivElement, StackProps>(
  function DrawerContainer(props, ref) {
    return (
      <Stack
        position="fixed"
        bottom="20px"
        right="0"
        w="52px"
        h="52px"
        backgroundColor="whiteAlpha.700"
        padding="2px"
        borderLeft="1px solid"
        borderTopLeftRadius="52px"
        borderBottomLeftRadius="52px"
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

export const SideDrawer = () => {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const [selectedDevices, setSelectedDevices] = useLocalStorage<Device[]>(
    "selectedDevices",
    [],
  );

  const selectedDevicesForRender = isHydrated ? selectedDevices : [];

  const handleRemoveRow = (index: number) => {
    const updatedRows = selectedDevicesForRender.filter((_, i) => i !== index);
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
                size="sm"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="green.700"
                fontSize="md"
                title="Open Comparison"
                padding="0"
                minW="auto"
                onClick={() => {
                  // track comparison drawer opened
                  posthog.capture("comparison_drawer_opened", {
                    device_count: selectedDevicesForRender.length,
                  });
                }}
              >
                <MdCompare />
                {selectedDevicesForRender.length > 0 && (
                  <Badge colorPalette="green">
                    {" "}
                    {selectedDevicesForRender.length}{" "}
                  </Badge>
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
                {selectedDevicesForRender.length > 0 && (
                  <Box display="flex" justifyContent="flex-end" mb="3">
                    <Button
                      size="xs"
                      variant="ghost"
                      color="red.500"
                      onClick={() => {
                        posthog.capture("comparison_cleared_all", {
                          device_count: selectedDevicesForRender.length,
                        });
                        setSelectedDevices([]);
                      }}
                    >
                      <MdClose />
                      Clear all
                    </Button>
                  </Box>
                )}
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
                          Decision Date
                        </Table.ColumnHeader>
                        <Table.ColumnHeader p={4} textAlign="end">
                          Number of Recalls
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {selectedDevicesForRender.map((selectedDevice, index) => {
                        if (!selectedDevice) return null;

                        return (
                          <Table.Row minH="400px" key={selectedDevice.id}>
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
                              {formatCell(selectedDevice.name)}
                            </Table.Cell>
                            <Table.Cell p={4}>
                              {selectedDevice.pCode}
                            </Table.Cell>
                            <Table.Cell p={4}>
                              {selectedDevice.sponsor}
                            </Table.Cell>
                            <Table.Cell p={4}>{selectedDevice.date}</Table.Cell>
                            <Table.Cell p={4} textAlign="end">
                              {selectedDevice.recalls}
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </Table.ScrollArea>
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
