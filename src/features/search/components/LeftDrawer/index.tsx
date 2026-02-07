import { Box, createTreeCollection, TreeView } from "@chakra-ui/react";

const test = {
  value: "root",
  label: "Root",
  children: [
    { code: "AN", label: "Anesthesiology" },
    { code: "CH", label: "Clinical Chemistry" },
    { code: "CV", label: "Cardiovascular" },
    { code: "DE", label: "Dental" },
    { code: "EN", label: "Ear, Nose, Throat" },
    { code: "GU", label: "Gastroenterology, Urology" },
    { code: "HE", label: "Hematology" },
    { code: "HO", label: "General Hospital" },
    { code: "IM", label: "Immunology" },
    { code: "MG", label: "Medical Genetics" },
    { code: "MI", label: "Microbiology" },
    { code: "NE", label: "Neurology" },
    { code: "OB", label: "Obstetrics/Gynecology" },
    { code: "OP", label: "Ophthalmic" },
    { code: "OR", label: "Orthopedic" },
    { code: "PA", label: "Pathology" },
    { code: "PM", label: "Physical Medicine" },
    { code: "RA", label: "Radiology" },
    { code: "SU", label: "General, Plastic Surgery" },
    { code: "TX", label: "Clinical Toxicology" },
  ],
};

const tree = createTreeCollection({
  rootNode: test,
  nodeToId: (node) => node.code || node.value,
  nodeToChildren: (node) => node.children,
});

export const LeftDrawer = () => {
  return (
    <Box bg="#F5F9F6" color="#266429" padding="24px" borderRadius="8px">
      <TreeView.Root collection={tree}>
        <TreeView.Label>Categories</TreeView.Label>
        <TreeView.Tree>
          <TreeView.Node
            render={({ node, nodeState }) => (
              <TreeView.Item>
                <TreeView.ItemText>
                  {node.code}: {node.label}
                </TreeView.ItemText>
              </TreeView.Item>
            )}
          />
        </TreeView.Tree>
      </TreeView.Root>
    </Box>
  );
};
