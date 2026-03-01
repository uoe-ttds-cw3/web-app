import { Box, Grid, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import posthog from "posthog-js";
import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import type { LineageResponse, DeviceLookupResponse } from "@/lib/api/types";

export type DeviceLineageSectionProps = {
  lineage: LineageResponse;
  device: DeviceLookupResponse;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onNodeClick: (_event: React.MouseEvent, node: Node) => void;
  nodeTypes: NodeTypes;
  translateExtent: [[number, number], [number, number]];
};

export const DeviceLineageSection = ({
  lineage,
  device,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  nodeTypes,
  translateExtent,
}: DeviceLineageSectionProps) => {
  if (!lineage) {
    return null;
  }

  return (
    <Box marginBottom="24px">
      <Heading size="md" color="brand.primary" marginBottom="12px">
        Predicate Lineage
      </Heading>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap="12px"
        marginBottom="12px"
      >
        <Box>
          <Text color="brand.primary" fontWeight="bold">
            Ancestors:
          </Text>
          <Text color="black">{lineage.ancestor_count}</Text>
        </Box>
        <Box>
          <Text color="brand.primary" fontWeight="bold">
            Descendants:
          </Text>
          <Text color="black">{lineage.descendant_count}</Text>
        </Box>
      </Grid>
      {lineage.direct_predicates.length > 0 && (
        <Box marginBottom="8px">
          <Text color="brand.primary" fontWeight="bold">
            Direct Predicates:
          </Text>
          <Text fontSize="xs" color="ui.textMuted" marginBottom="4px">
            Predicate Device - This device claims substantial equivalence to the
            following:
          </Text>
          <Box>
            {lineage.direct_predicates.map((predicate, index) => (
              <Box key={predicate} display="inline">
                <Link href={`/devices/${predicate}`}>
                  <ChakraLink
                    color="brand.primary"
                    textDecoration="underline"
                    cursor="pointer"
                    onClick={() => {
                      posthog.capture("predicate_device_clicked", {
                        from_device_id: device.submission_number,
                        from_device_name: device.device_name,
                        predicate_device_id: predicate,
                      });
                    }}
                  >
                    {predicate}
                  </ChakraLink>
                </Link>
                {index < lineage.direct_predicates.length - 1 && (
                  <Text display="inline" color="black" marginX="4px">
                    ,
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {lineage.direct_predicates.length > 0 || lineage.direct_citations.length > 0 ? (
        <Box marginTop="16px">
          <Text color="brand.primary" fontWeight="bold" marginBottom="8px">
            Lineage Graph:
          </Text>
          <Text fontSize="xs" color="ui.textMuted" marginBottom="8px">
            Click on any device to view its details.
          </Text>
          <Box
            height="400px"
            borderWidth="1px"
            borderColor="ui.border"
            borderRadius="8px"
            overflow="hidden"
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.5}
              maxZoom={1.5}
              translateExtent={translateExtent}
              nodesDraggable={false}
              proOptions={{ hideAttribution: true }}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </Box>
        </Box>
      ) : (
        <Box marginTop="12px">
          <Text fontSize="sm" color="ui.textMuted">
            no known predicate relationships
          </Text>
        </Box>
      )}

      {lineage.pagerank !== null && (
        <Box marginTop="12px">
          <Text color="brand.primary" fontWeight="bold">
            Citation Influence:
          </Text>
          <Text color="black">
            {lineage.pagerank > 0.001
              ? "Very High"
              : lineage.pagerank > 0.0001
                ? "High"
                : lineage.pagerank > 0.00001
                  ? "Moderate"
                  : lineage.pagerank > 0.000001
                    ? "Low"
                    : "Minimal"}
          </Text>
          <Text fontSize="xs" color="ui.textMuted">
            Based on how often this device is cited as a predicate (
            {lineage.pagerank.toExponential(2)})
          </Text>
        </Box>
      )}
    </Box>
  );
};
