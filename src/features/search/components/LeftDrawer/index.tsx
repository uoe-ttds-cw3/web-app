import React, { useEffect, useState } from "react";
import {
  Checkmark,
  createTreeCollection,
  TreeView,
  Collapsible,
  useTreeViewNodeContext,
  Box,
} from "@chakra-ui/react";
import { PiArrowLeft, PiArrowRight } from "react-icons/pi";
import { LuFile, LuFolder } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";

export type TreeNodeData = {
  id: string;
  name: string;
  children?: TreeNodeData[];
  sample_children?: any[];
};

const fetchTreeData = async (): Promise<TreeNodeData> => {
  const response = await fetch("/data/devicetree.json");
  if (!response.ok) {
    throw new Error("Failed to fetch tree data");
  }
  return response.json();
};

type LeftDrawerProps = {
  treeData?: TreeNodeData;
  onCategorySelect?: (categoryId: string) => void;
};

const TreeNodeCheckbox = (props: TreeView.NodeCheckboxProps) => {
  const nodeState = useTreeViewNodeContext();
  return (
    <TreeView.NodeCheckbox aria-label="check node" {...props}>
      <Checkmark
        bg={{
          base: "bg",
          _checked: "green.500",
          _indeterminate: "green.300",
        }}
        size="sm"
        checked={nodeState.checked === true}
        indeterminate={nodeState.checked === "indeterminate"}
      />
    </TreeView.NodeCheckbox>
  );
};

export const LeftDrawer = ({
  treeData: treeDataProp,
  onCategorySelect,
}: LeftDrawerProps) => {
  const {
    data: fetchedTreeData,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["deviceTree"],
    queryFn: fetchTreeData,
    enabled: !treeDataProp,
  });

  const treeData = treeDataProp || fetchedTreeData || [];

  const collection = React.useMemo(() => {
    if (!treeData) return null;
    return createTreeCollection({
      rootNode: treeData,
      nodeToValue: (node) => node?.id || node?.name,
      nodeToChildren: (node) => {
        return node?.children && node.children.length > 0
          ? node.children
          : undefined;
      },
    });
  }, [treeData]);

  if (!treeData || !collection) return null;

  return (
    <Box
      bg="#F5F9F632" // Light gray-green background matching the image
      borderRadius="xl" // Rounded corners
      overflow="hidden" // Crucial: prevents the header's background from spilling over the rounded corners
      height="100%" // Ensure it stretches if you have a fixed height
      // Just for demonstration, adjust as needed
      display="flex"
      flexDirection="column"
      border="1px solid"
      borderColor="blackAlpha.100" // Subtle border
    >
      <Collapsible.Root defaultOpen unmountOnExit>
        <Collapsible.Trigger
          w="full"
          paddingY="4"
          paddingX="4"
          display="flex"
          gap="2"
          alignItems="center"
          bg="#e8f5e98f"
          color="#266429"
          fontWeight="semibold"
          fontSize="md"
        >
          <Collapsible.Indicator
            transition="transform 0.2s"
            _open={{ transform: "rotate(90deg)" }}
          >
            <PiArrowRight />
          </Collapsible.Indicator>
          Medical Device Tree
        </Collapsible.Trigger>
        <Collapsible.Content>
          <TreeView.Root
            collection={collection}
            selectionMode="multiple"
            defaultCheckedValue={[]}
          >
            <TreeView.Label display="none">Categories</TreeView.Label>
            <TreeView.Tree>
              <TreeView.Node
                indentGuide={<TreeView.BranchIndentGuide />}
                render={({ node, nodeState }) =>
                  nodeState.isBranch ? (
                    <TreeView.Branch>
                      <TreeView.BranchControl
                        py="2"
                        px="3"
                        borderRadius="md"
                        color="#266429"
                        transition="background 0.2s"
                        _hover={{ bg: "#4CAF501F" }}
                      >
                        <TreeNodeCheckbox />
                        <LuFolder />
                        <TreeView.BranchText>{node.name}</TreeView.BranchText>
                      </TreeView.BranchControl>
                    </TreeView.Branch>
                  ) : (
                    <TreeView.Item
                      fontSize="xs"
                      py="2"
                      pl={5}
                      borderRadius="md"
                      color="#266429"
                      transition="background 0.2s"
                      _hover={{ bg: "#4CAF501F" }}
                    >
                      <TreeNodeCheckbox />
                      <LuFile />
                      <TreeView.ItemText>{node.name}</TreeView.ItemText>
                    </TreeView.Item>
                  )
                }
              />
            </TreeView.Tree>
          </TreeView.Root>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};
