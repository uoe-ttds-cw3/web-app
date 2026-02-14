import React, { useEffect, useState } from "react";
import {
  Checkmark,
  createTreeCollection,
  TreeView,
  Collapsible,
  useTreeViewNodeContext,
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
    <TreeView.NodeCheckbox {...props}>
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
        if (node?.children && node.children.length > 0) {
          return node.children;
        }
        return undefined;
      },
    });
  }, [treeData]);

  if (!treeData || !collection) return null;

  return (
    <Collapsible.Root defaultOpen unmountOnExit>
      <Collapsible.Trigger
        paddingY="3"
        display="flex"
        gap="2"
        alignItems="left"
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
        <TreeView.Root collection={collection} selectionMode="multiple">
          <TreeView.Label>Categories</TreeView.Label>
          <TreeView.Tree>
            <TreeView.Node
              render={({ node, nodeState }) =>
                nodeState.isBranch ? (
                  <TreeView.Branch>
                    <TreeView.BranchControl>
                      <TreeNodeCheckbox />
                      <LuFolder />
                      <TreeView.BranchText>{node.name}</TreeView.BranchText>
                      <TreeView.BranchIndicator />
                    </TreeView.BranchControl>
                    <TreeView.BranchContent>
                      {/* children */}
                    </TreeView.BranchContent>
                  </TreeView.Branch>
                ) : (
                  <TreeView.Item>
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
  );
};
