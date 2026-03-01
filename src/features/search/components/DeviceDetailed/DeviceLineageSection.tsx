import {
  Box,
  Grid,
  Heading,
  Link as ChakraLink,
  Separator,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, type MouseEvent } from "react";
import dagre from "dagre";
import posthog from "posthog-js";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { LineageResponse, DeviceLookupResponse } from "@/lib/api/types";

export type DeviceLineageSectionProps = {
  lineage: LineageResponse | null;
  device: DeviceLookupResponse;
};

const DeviceNode = ({
  data,
}: {
  data: { label: string; isCurrent: boolean };
}) => {
  return (
    <Box
      padding="8px 12px"
      borderRadius="8px"
      borderWidth="2px"
      borderColor={data.isCurrent ? "brand.primary" : "ui.border"}
      backgroundColor={data.isCurrent ? "brand.light" : "white"}
      fontWeight={data.isCurrent ? "bold" : "normal"}
      fontSize="sm"
      color="black"
      cursor="pointer"
      _hover={{ borderColor: "brand.primary", backgroundColor: "brand.light" }}
      minWidth="120px"
      textAlign="center"
      position="relative"
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, width: 1, height: 1 }}
      />
      {data.label}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, width: 1, height: 1 }}
      />
    </Box>
  );
};

const nodeTypes: NodeTypes = {
  device: DeviceNode,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB", ranksep: 80, nodesep: 40 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 150, height: 50 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);

      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 75,
          y: nodeWithPosition.y - 25,
        },
      };
    }),
    edges,
  };
};

export const DeviceLineageSection = ({
  lineage,
  device,
}: DeviceLineageSectionProps) => {
  const router = useRouter();

  const { nodes, edges } = useMemo(() => {
    if (!lineage) {
      return { nodes: [], edges: [] };
    }

    if (
      lineage.direct_predicates.length === 0 &&
      lineage.direct_citations.length === 0
    ) {
      return { nodes: [], edges: [] };
    }

    const nodes: Node[] = [
      {
        id: device.submission_number,
        type: "device",
        data: { label: device.submission_number, isCurrent: true },
        position: { x: 0, y: 0 },
      },
    ];
    const edges: Edge[] = [];

    const predicates = lineage.direct_predicates.slice(0, 15);
    const hasMorePredicates = lineage.direct_predicates.length > 15;

    predicates.forEach((predicate) => {
      nodes.push({
        id: predicate,
        type: "device",
        data: { label: predicate, isCurrent: false },
        position: { x: 0, y: 0 },
      });
      edges.push({
        id: `${predicate}-${device.submission_number}`,
        source: predicate,
        target: device.submission_number,
        type: "smoothstep",
        animated: false,
        style: { stroke: "#1E5AA8", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#1E5AA8",
          width: 20,
          height: 20,
        },
      });
    });

    if (hasMorePredicates) {
      const moreCount = lineage.direct_predicates.length - 15;
      nodes.push({
        id: "more-predicates",
        type: "device",
        data: { label: `and ${moreCount} more...`, isCurrent: false },
        position: { x: 0, y: 0 },
      });
      edges.push({
        id: `more-predicates-${device.submission_number}`,
        source: "more-predicates",
        target: device.submission_number,
        type: "smoothstep",
        animated: false,
        style: { stroke: "#9CA3AF", strokeWidth: 2, strokeDasharray: "5,5" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#9CA3AF",
          width: 20,
          height: 20,
        },
      });
    }

    const citations = lineage.direct_citations.slice(0, 15);
    const hasMoreCitations = lineage.direct_citations.length > 15;

    citations.forEach((citation) => {
      nodes.push({
        id: citation,
        type: "device",
        data: { label: citation, isCurrent: false },
        position: { x: 0, y: 0 },
      });
      edges.push({
        id: `${device.submission_number}-${citation}`,
        source: device.submission_number,
        target: citation,
        type: "smoothstep",
        animated: false,
        style: { stroke: "#1E5AA8", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#1E5AA8",
          width: 20,
          height: 20,
        },
      });
    });

    if (hasMoreCitations) {
      const moreCount = lineage.direct_citations.length - 15;
      nodes.push({
        id: "more-citations",
        type: "device",
        data: { label: `and ${moreCount} more...`, isCurrent: false },
        position: { x: 0, y: 0 },
      });
      edges.push({
        id: `${device.submission_number}-more-citations`,
        source: device.submission_number,
        target: "more-citations",
        type: "smoothstep",
        animated: false,
        style: { stroke: "#9CA3AF", strokeWidth: 2, strokeDasharray: "5,5" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#9CA3AF",
          width: 20,
          height: 20,
        },
      });
    }

    return getLayoutedElements(nodes, edges);
  }, [device.submission_number, lineage]);

  const translateExtent = useMemo((): [[number, number], [number, number]] => {
    if (nodes.length === 0) {
      return [
        [-200, -200],
        [200, 200],
      ];
    }

    const pad = 200;
    const xs = nodes.map((node) => node.position.x);
    const ys = nodes.map((node) => node.position.y);

    return [
      [Math.min(...xs) - pad, Math.min(...ys) - pad],
      [Math.max(...xs) + 300 + pad, Math.max(...ys) + 100 + pad],
    ];
  }, [nodes]);

  const onNodeClick = (_event: MouseEvent, node: Node) => {
    if (node.id.startsWith("more-")) {
      return;
    }

    posthog.capture("lineage_graph_node_clicked", {
      from_device_id: device.submission_number,
      from_device_name: device.device_name,
      clicked_device_id: node.id,
    });

    router.push(`/devices/${node.id}`);
  };

  if (!lineage) {
    return null;
  }

  return (
    <>
      <Separator marginY="16px" />
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

        {lineage.direct_predicates.length > 0 ||
        lineage.direct_citations.length > 0 ? (
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
    </>
  );
};
