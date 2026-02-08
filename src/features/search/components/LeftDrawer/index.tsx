import React from "react";
import {
  Checkmark,
  createTreeCollection,
  TreeView,
  Collapsible,
  useTreeViewNodeContext,
  Box,
  Icon,
} from "@chakra-ui/react";
import {
  PanelsResponse,
  fetchPanels,
} from "@/features/search/components/NavBar";
import { PiArrowLeft, PiArrowRight } from "react-icons/pi";
import { LuFile, LuFolder } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";

type Category = {
  id: string;
  name: string;
  code?: string;
  children?: Category[];
};

type LeftDrawerProps = {
  categories?: Category[];
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
  categories: categoriesProp,
  onCategorySelect,
}: LeftDrawerProps) => {
  const {
    data: fetchedCategories,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["panels"],
    queryFn: fetchPanels,
    enabled: !categoriesProp,
  });

  const categories = categoriesProp || fetchedCategories || [];

  const collection = React.useMemo(() => {
    return createTreeCollection({
      rootNode: {
        id: "ROOT",
        name: "Root",
        children: categories,
      },
      nodeToValue: (node) => node.id || node.code || node.name,
      nodeToChildren: (node) => node.children,
    });
  }, [categories]);

  if (!categories.length) return null;

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
        Hierarchy
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
                    <TreeView.ItemText>
                      {node.name || node.label}
                    </TreeView.ItemText>
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
