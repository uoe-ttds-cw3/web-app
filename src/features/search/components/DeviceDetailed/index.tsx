import {
  Box,
  Text,
  Heading,
  Grid,
  Badge,
  Separator,
  Link as ChakraLink,
  Card,
  HStack,
  Skeleton,
} from "@chakra-ui/react";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type NodeTypes,
} from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import posthog from "posthog-js";
import { useSearch } from "@/lib/queries/useSearch";
import type {
  DeviceLookupResponse,
  LineageResponse,
  SafetyProfileResponse,
} from "@/lib/api/types";

type DeviceDetailedProps = {
  device: DeviceLookupResponse;
  lineage: LineageResponse | null;
  safety: SafetyProfileResponse | null;
};

// custom node component for the lineage graph
const DeviceNode = ({ data }: { data: { label: string; isCurrent: boolean } }) => {
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
    >
      {data.label}
    </Box>
  );
};

const nodeTypes: NodeTypes = {
  device: DeviceNode,
};

// dagre layout algorithm for automatic graph positioning
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

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 75, // center the node (half of width)
        y: nodeWithPosition.y - 25, // center the node (half of height)
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const DeviceDetailed = ({
  device,
  lineage,
  safety,
}: DeviceDetailedProps) => {
  const router = useRouter();
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showFullIfu, setShowFullIfu] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // fetch related devices from same manufacturer
  const { data: manufacturerDevices, isLoading: isLoadingManufacturer } = useSearch(
    device.sponsor || "",
    { limit: 6 }
  );

  // fetch similar devices with same product code using filter, not free-text
  const { data: similarDevices, isLoading: isLoadingSimilar } = useSearch(
    device.device_name || "",
    { limit: 6, product_code: device.product_code || undefined }
  );

  // filter out current device from manufacturer results
  const filteredManufacturerDevices = useMemo(() => {
    if (!manufacturerDevices?.results) return [];
    return manufacturerDevices.results
      .filter((d) => d.submission_number !== device.submission_number)
      .slice(0, 5);
  }, [manufacturerDevices, device.submission_number]);

  // filter out current device from similar results
  const filteredSimilarDevices = useMemo(() => {
    if (!similarDevices?.results) return [];
    return similarDevices.results
      .filter((d) => d.submission_number !== device.submission_number)
      .slice(0, 5);
  }, [similarDevices, device.submission_number]);

  // build lineage graph from lineage data
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!lineage || (lineage.direct_predicates.length === 0 && lineage.direct_citations.length === 0)) {
      return { nodes: [], edges: [] };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // current device node (centered, highlighted)
    nodes.push({
      id: device.submission_number,
      type: "device",
      data: { label: device.submission_number, isCurrent: true },
      position: { x: 0, y: 0 }, // will be overridden by dagre layout
    });

    // limit predicates to first 15 if too many
    const predicates = lineage.direct_predicates.slice(0, 15);
    const hasMorePredicates = lineage.direct_predicates.length > 15;

    // add predicate nodes (parents - devices this one cites)
    predicates.forEach((predicate) => {
      nodes.push({
        id: predicate,
        type: "device",
        data: { label: predicate, isCurrent: false },
        position: { x: 0, y: 0 },
      });
      // edge from predicate to current device (parent → child)
      edges.push({
        id: `${predicate}-${device.submission_number}`,
        source: predicate,
        target: device.submission_number,
        animated: false,
        style: { stroke: "var(--chakra-colors-brand-primary)" },
      });
    });

    // add "and N more" indicator node if predicates were limited
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
        animated: false,
        style: { stroke: "#9CA3AF", strokeDasharray: "5,5" },
      });
    }

    // limit citations to first 15 if too many
    const citations = lineage.direct_citations.slice(0, 15);
    const hasMoreCitations = lineage.direct_citations.length > 15;

    // add citation nodes (children - devices that cite this one)
    citations.forEach((citation) => {
      nodes.push({
        id: citation,
        type: "device",
        data: { label: citation, isCurrent: false },
        position: { x: 0, y: 0 },
      });
      // edge from current device to citation (parent → child)
      edges.push({
        id: `${device.submission_number}-${citation}`,
        source: device.submission_number,
        target: citation,
        animated: false,
        style: { stroke: "var(--chakra-colors-brand-primary)" },
      });
    });

    // add "and N more" indicator node if citations were limited
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
        animated: false,
        style: { stroke: "#9CA3AF", strokeDasharray: "5,5" },
      });
    }

    return getLayoutedElements(nodes, edges);
  }, [lineage, device.submission_number]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // handle node click to navigate to device detail page
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // don't navigate for "and N more" indicator nodes
      if (node.id.startsWith("more-")) {
        return;
      }

      // track lineage graph node click
      posthog.capture("lineage_graph_node_clicked", {
        from_device_id: device.submission_number,
        from_device_name: device.device_name,
        clicked_device_id: node.id,
      });

      router.push(`/devices/${node.id}`);
    },
    [router, device.submission_number, device.device_name]
  );

  // format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // format iso date to readable string
  const formatDate = (isoDate: string | null): string => {
    if (!isoDate) return "N/A";
    try {
      const d = new Date(isoDate + "T00:00:00");
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoDate;
    }
  };

  let yearpart = "";

  if (device.date_received) {
    const year = parseInt(device.date_received.slice(0, 4), 10);

    if (year >= 2000) {
      yearpart = device.date_received.slice(2, 4).replace(/^0/, "");
    }
  }

  // try to find the useful section of the summary text instead of showing raw pdf header
  const extractUsefulSummary = (text: string): string => {
    // look for common section headings in fda 510(k) summaries
    const sectionPatterns = [
      /indications?\s+for\s+use/i,
      /device\s+description/i,
      /predicate\s+device/i,
      /intended\s+use/i,
      /summary\s+of\s+submission/i,
    ];

    for (const pattern of sectionPatterns) {
      const match = text.search(pattern);
      if (match !== -1) {
        return text.substring(match);
      }
    }

    // fallback: skip past the fda letter header (usually starts with date, address, "Re: K...")
    const reMatch = text.search(/Re:\s*K\d/i);
    if (reMatch !== -1) {
      // find the next paragraph after the "Re:" line
      const afterRe = text.indexOf("\n", reMatch + 10);
      if (afterRe !== -1) {
        return text.substring(afterRe).trim();
      }
    }

    // last fallback: return as-is
    return text;
  };

  const usefulSummary = device.summary_text
    ? extractUsefulSummary(device.summary_text)
    : null;
  const truncatedSummary =
    usefulSummary && usefulSummary.length > 300
      ? usefulSummary.substring(0, 300) + "..."
      : usefulSummary;
  const displaySummary = showFullSummary ? usefulSummary : truncatedSummary;

  return (
    <Card.Root
      backgroundColor="white"
      padding="24px"
      borderRadius="12px"
      maxWidth="1200px"
      borderWidth="1px"
      borderColor="ui.border"
    >
      {/* header */}
      <Box marginBottom="24px">
        <Heading size="xl" color="brand.primary" marginBottom="8px">
          {device.device_name}
        </Heading>
        <Box display="flex" alignItems="center" gap="8px" marginBottom="8px" flexWrap="wrap">
          <Badge
            colorScheme="gray"
            fontSize="md"
            padding="4px 8px"
            userSelect="text"
          >
            {device.submission_number}
          </Badge>
          {/* link to the official fda 510(k) pdf using date_received for the url path */}
          {device.date_received && (
            <ChakraLink
              href={`https://www.accessdata.fda.gov/cdrh_docs/pdf${yearpart}/${device.submission_number}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              color="brand.primary"
              fontSize="sm"
              textDecoration="underline"
              onClick={() => {
                // track fda document link click
                posthog.capture("fda_document_link_clicked", {
                  device_id: device.submission_number,
                  device_name: device.device_name,
                  product_code: device.product_code,
                });
              }}
            >
              View FDA document ↗
            </ChakraLink>
          )}
          {/* fda pmn database link */}
          <ChakraLink
            href={`https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${device.submission_number}`}
            target="_blank"
            rel="noopener noreferrer"
            color="brand.primary"
            fontSize="sm"
            textDecoration="underline"
          >
            View on FDA ↗
          </ChakraLink>
        </Box>
        <Box>
          <Text fontSize="lg" color="black" display="inline">
            Manufacturer:{" "}
          </Text>
          <ChakraLink
            onClick={() => router.push({ pathname: "/", query: { q: device.sponsor } })}
            fontWeight="bold"
            color="brand.primary"
            textDecoration="underline"
            cursor="pointer"
            fontSize="lg"
          >
            {device.sponsor}
          </ChakraLink>
          {/* fda manufacturer search link */}
          <ChakraLink
            href={`https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfPMN/pmn.cfm?applicant=${encodeURIComponent(device.sponsor)}`}
            target="_blank"
            rel="noopener noreferrer"
            color="brand.primary"
            fontSize="xs"
            textDecoration="underline"
            marginLeft="8px"
          >
            View on FDA ↗
          </ChakraLink>
        </Box>
      </Box>

      <Separator marginY="16px" />

      {/* metadata grid - responsive */}
      <Box marginBottom="24px">
        <Heading size="md" color="brand.primary" marginBottom="12px">
          Device Information
        </Heading>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap="12px"
        >
          <Box>
            <Text color="brand.primary" fontWeight="bold">
              Product Code:
            </Text>
            <Text color="black">{device.product_code || "N/A"}</Text>
          </Box>
          <Box>
            <Text color="brand.primary" fontWeight="bold">
              Panel:
            </Text>
            <Text color="black">{device.panel || "N/A"}</Text>
          </Box>
          <Box>
            <Text color="brand.primary" fontWeight="bold">
              Decision:
            </Text>
            <Text color="black">{device.decision || "N/A"}</Text>
          </Box>
          <Box>
            <Text color="brand.primary" fontWeight="bold">
              Decision Date:
            </Text>
            <Text color="black">{formatDate(device.decision_date)}</Text>
          </Box>
        </Grid>
      </Box>

      {/* feature flags */}
      <Separator marginY="16px" />
      <Box marginBottom="24px">
        <Heading size="md" color="brand.primary" marginBottom="12px">
          Feature Flags
        </Heading>
        <HStack gap="3" flexWrap="wrap">
          <Badge
            colorPalette={device.has_clinical_data ? "green" : "gray"}
            variant="subtle"
            padding="4px 8px"
          >
            clinical data
          </Badge>
          <Badge
            colorPalette={device.has_sterilization ? "green" : "gray"}
            variant="subtle"
            padding="4px 8px"
          >
            sterilization
          </Badge>
          <Badge
            colorPalette={device.has_biocompatibility ? "green" : "gray"}
            variant="subtle"
            padding="4px 8px"
          >
            biocompatibility
          </Badge>
          <Badge
            colorPalette={device.has_software ? "green" : "gray"}
            variant="subtle"
            padding="4px 8px"
          >
            software
          </Badge>
          <Badge
            colorPalette={device.has_electrical_safety ? "green" : "gray"}
            variant="subtle"
            padding="4px 8px"
          >
            electrical safety
          </Badge>
        </HStack>
      </Box>

      {/* indications for use */}
      {device.indications_for_use && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Indications for Use
            </Heading>
            <Box
              padding="12px"
              borderRadius="4px"
              backgroundColor="ui.surface"
              borderWidth="1px"
              borderColor="ui.border"
            >
              <Text color="black" whiteSpace="pre-wrap">
                {showFullIfu || device.indications_for_use.length <= 300
                  ? device.indications_for_use
                  : device.indications_for_use.substring(0, 300) + "..."}
              </Text>
              {device.indications_for_use.length > 300 && (
                <Text
                  color="brand.primary"
                  marginTop="8px"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => setShowFullIfu(!showFullIfu)}
                >
                  {showFullIfu ? "show less" : "show more"}
                </Text>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* device description */}
      {device.device_description && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Device Description
            </Heading>
            <Box
              padding="12px"
              borderRadius="4px"
              backgroundColor="ui.surface"
              borderWidth="1px"
              borderColor="ui.border"
            >
              <Text color="black" whiteSpace="pre-wrap">
                {showFullDescription || device.device_description.length <= 300
                  ? device.device_description
                  : device.device_description.substring(0, 300) + "..."}
              </Text>
              {device.device_description.length > 300 && (
                <Text
                  color="brand.primary"
                  marginTop="8px"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "show less" : "show more"}
                </Text>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* materials */}
      {device.materials && device.materials.length > 0 && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Materials
            </Heading>
            <HStack gap="2" flexWrap="wrap">
              {device.materials.map((material) => (
                <Badge
                  key={material}
                  variant="subtle"
                  colorPalette="gray"
                  padding="4px 8px"
                >
                  {material}
                </Badge>
              ))}
            </HStack>
          </Box>
        </>
      )}

      {/* standards referenced */}
      {device.standards_referenced &&
        device.standards_referenced.length > 0 && (
          <>
            <Separator marginY="16px" />
            <Box marginBottom="24px">
              <Heading size="md" color="brand.primary" marginBottom="12px">
                Standards Referenced
              </Heading>
              <Box>
                {device.standards_referenced.map((standard) => (
                  <Text
                    key={standard}
                    fontSize="sm"
                    color="black"
                    marginBottom="4px"
                  >
                    {standard}
                  </Text>
                ))}
              </Box>
            </Box>
          </>
        )}

      {/* sterilization methods */}
      {device.sterilization_methods &&
        device.sterilization_methods.length > 0 && (
          <>
            <Separator marginY="16px" />
            <Box marginBottom="24px">
              <Heading size="md" color="brand.primary" marginBottom="12px">
                Sterilization Methods
              </Heading>
              <HStack gap="2" flexWrap="wrap">
                {device.sterilization_methods.map((method) => (
                  <Badge
                    key={method}
                    variant="subtle"
                    colorPalette="gray"
                    padding="4px 8px"
                  >
                    {method}
                  </Badge>
                ))}
              </HStack>
            </Box>
          </>
        )}

      {/* 510(k) summary - collapsible */}
      {usefulSummary && usefulSummary.length > 0 && (
        <>
          <Separator marginY="16px" />
          <Box marginBottom="24px">
            <Heading size="md" color="brand.primary" marginBottom="12px">
              510(k) Summary
            </Heading>
            <Box
              padding="12px"
              borderRadius="4px"
              backgroundColor="ui.surface"
              borderWidth="1px"
              borderColor="ui.border"
            >
              <Text color="black" whiteSpace="pre-wrap">
                {displaySummary}
              </Text>
              {usefulSummary && usefulSummary.length > 300 && (
                <Text
                  color="brand.primary"
                  marginTop="8px"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => setShowFullSummary(!showFullSummary)}
                >
                  {showFullSummary ? "show less" : "show more"}
                </Text>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* lineage section */}
      {lineage && (
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
                  Predicate Device - This device claims substantial equivalence to the following:
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
                            // track predicate device click
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

            {/* interactive lineage graph */}
            {(lineage.direct_predicates.length > 0 || lineage.direct_citations.length > 0) ? (
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
                    ? "very high"
                    : lineage.pagerank > 0.0001
                      ? "high"
                      : lineage.pagerank > 0.00001
                        ? "moderate"
                        : lineage.pagerank > 0.000001
                          ? "low"
                          : "minimal"}
                </Text>
                <Text fontSize="xs" color="ui.textMuted">
                  based on how often this device is cited as a predicate ({lineage.pagerank.toExponential(2)})
                </Text>
              </Box>
            )}
          </Box>
        </>
      )}

      {/* safety section */}
      {safety && (
        <>
          <Separator marginY="16px" />
          <Box>
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Safety Data
            </Heading>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap="12px"
              marginBottom="12px"
            >
              <Box>
                <Text color="brand.primary" fontWeight="bold">
                  Recalls:
                </Text>
                <Text
                  color={
                    safety.recall_count === 0
                      ? "status.safe"
                      : safety.recall_count <= 5
                        ? "status.warning"
                        : "status.danger"
                  }
                  fontWeight="bold"
                  fontSize="lg"
                >
                  {safety.recall_count}
                </Text>
              </Box>
              <Box>
                <Text color="brand.primary" fontWeight="bold">
                  Adverse Events:
                </Text>
                <Text color="black" fontSize="lg">
                  {formatNumber(safety.adverse_event_count)}
                </Text>
              </Box>
            </Grid>
            {safety.event_breakdown.total > 0 &&
              (() => {
                const severityOrder = [
                  "Death",
                  "Injury",
                  "Malfunction",
                  "Other",
                  "Unknown",
                  "Unclassified",
                ];
                const severityColors: Record<string, string> = {
                  Death: "var(--chakra-colors-status-danger)",
                  Injury: "var(--chakra-colors-status-warning)",
                  Malfunction: "var(--chakra-colors-brand-primary)",
                  Other: "#6B7280",
                  Unknown: "#9CA3AF",
                  Unclassified: "#000000",
                };

                const sortedEvents = Object.entries(
                  safety.event_breakdown.counts,
                )
                  .map(([type, count]) => ({
                    type: type.trim() === "" ? "Unclassified" : type,
                    count,
                  }))
                  .sort((a, b) => {
                    const aIdx = severityOrder.indexOf(a.type);
                    const bIdx = severityOrder.indexOf(b.type);
                    return (
                      (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx)
                    );
                  });

                return (
                  <Box marginBottom="12px">
                    <Text
                      color="brand.primary"
                      fontWeight="bold"
                      marginBottom="4px"
                    >
                      Event Breakdown:
                    </Text>
                    {sortedEvents.map(({ type, count }) => {
                      const percentage = (
                        (count / safety.event_breakdown.total) *
                        100
                      ).toFixed(1);
                      const color = severityColors[type] || "#6B7280";
                      return (
                        <Text key={type} fontSize="sm" style={{ color }}>
                          {type}: {formatNumber(count)} ({percentage}%)
                        </Text>
                      );
                    })}
                    {/* show chart if 2+ event types exist */}
                    {sortedEvents.length >= 2 && (
                      <Box marginTop="16px">
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart
                            data={sortedEvents.map(({ type, count }) => ({
                              type,
                              count,
                              percentage: (
                                (count / safety.event_breakdown.total) *
                                100
                              ).toFixed(1),
                            }))}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis type="number" />
                            <YAxis dataKey="type" type="category" width={150} />
                            <Tooltip />
                            <Bar dataKey="count">
                              {sortedEvents.map(({ type }) => (
                                <Cell
                                  key={type}
                                  fill={severityColors[type] || "#6B7280"}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </Box>
                );
              })()}
            {safety.most_recent_recall_date && (
              <Box>
                <Text color="brand.primary" fontWeight="bold">
                  Most Recent Recall:
                </Text>
                <Text color="black" marginBottom="4px">{safety.most_recent_recall_date}</Text>
              </Box>
            )}
            {safety.recall_count > 0 && (
              <Box marginTop="8px">
                {/* Link doesn't work */}
                {/* <ChakraLink
                  href="https://www.accessdata.fda.gov/scripts/cdrh/cfRes/res.cfm"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="brand.primary"
                  fontSize="sm"
                  textDecoration="underline"
                >
                  Search FDA Recall Database ↗
                </ChakraLink> */}
              </Box>
            )}
          </Box>
        </>
      )}

      {/* related devices from manufacturer */}
      {(isLoadingManufacturer || filteredManufacturerDevices.length > 0) && (
        <>
          <Separator marginY="16px" />
          <Box>
            <Heading size="md" color="brand.primary" marginBottom="12px">
              More from {device.sponsor}
            </Heading>
            {isLoadingManufacturer ? (
              <HStack gap="3" overflowX="auto" paddingY="8px">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} height="120px" minWidth="220px" borderRadius="8px" />
                ))}
              </HStack>
            ) : (
              <HStack gap="3" overflowX="auto" paddingY="8px">
                {filteredManufacturerDevices.map((relatedDevice) => (
                  <Box
                    key={relatedDevice.submission_number}
                    minWidth="220px"
                    maxWidth="220px"
                    height="170px"
                    display="flex"
                    flexDirection="column"
                    padding="12px"
                    borderWidth="1px"
                    borderColor="ui.border"
                    borderRadius="8px"
                    cursor="pointer"
                    _hover={{
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      borderColor: "brand.primary",
                    }}
                    onClick={() => {
                      posthog.capture("related_manufacturer_device_clicked", {
                        from_device_id: device.submission_number,
                        from_device_name: device.device_name,
                        to_device_id: relatedDevice.submission_number,
                        to_device_name: relatedDevice.device_name,
                      });
                      router.push(`/devices/${relatedDevice.submission_number}`);
                    }}
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color="brand.primary"
                      marginBottom="8px"
                      lineClamp={2}
                      lineHeight="1.3"
                      minHeight="36px"
                    >
                      {relatedDevice.device_name}
                    </Text>
                    <Text fontSize="xs" color="ui.textMuted" marginBottom="4px">
                      {relatedDevice.submission_number}
                    </Text>
                    {relatedDevice.decision_date && (
                      <Text fontSize="xs" color="ui.textMuted">
                        {formatDate(relatedDevice.decision_date)}
                      </Text>
                    )}
                  </Box>
                ))}
              </HStack>
            )}
          </Box>
        </>
      )}

      {/* similar devices with same product code */}
      {(isLoadingSimilar || filteredSimilarDevices.length > 0) && (
        <>
          <Separator marginY="16px" />
          <Box>
            <Heading size="md" color="brand.primary" marginBottom="12px">
              Similar Devices
            </Heading>
            <Text fontSize="sm" color="ui.textMuted" marginBottom="8px">
              Devices with Product Code: {device.product_code}
            </Text>
            {isLoadingSimilar ? (
              <HStack gap="3" overflowX="auto" paddingY="8px">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} height="120px" minWidth="220px" borderRadius="8px" />
                ))}
              </HStack>
            ) : (
              <HStack gap="3" overflowX="auto" paddingY="8px">
                {filteredSimilarDevices.map((relatedDevice) => (
                  <Box
                    key={relatedDevice.submission_number}
                    minWidth="220px"
                    maxWidth="220px"
                    height="170px"
                    display="flex"
                    flexDirection="column"
                    padding="12px"
                    borderWidth="1px"
                    borderColor="ui.border"
                    borderRadius="8px"
                    cursor="pointer"
                    _hover={{
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      borderColor: "brand.primary",
                    }}
                    onClick={() => {
                      posthog.capture("related_similar_device_clicked", {
                        from_device_id: device.submission_number,
                        from_device_name: device.device_name,
                        to_device_id: relatedDevice.submission_number,
                        to_device_name: relatedDevice.device_name,
                        product_code: device.product_code,
                      });
                      router.push(`/devices/${relatedDevice.submission_number}`);
                    }}
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color="brand.primary"
                      marginBottom="8px"
                      lineClamp={2}
                      lineHeight="1.3"
                      minHeight="36px"
                    >
                      {relatedDevice.device_name}
                    </Text>
                    <Text fontSize="xs" color="ui.textMuted" marginBottom="4px">
                      {relatedDevice.submission_number}
                    </Text>
                    <Text fontSize="xs" color="ui.textMuted" marginBottom="4px">
                      {relatedDevice.sponsor}
                    </Text>
                    {relatedDevice.decision_date && (
                      <Text fontSize="xs" color="ui.textMuted">
                        {formatDate(relatedDevice.decision_date)}
                      </Text>
                    )}
                  </Box>
                ))}
              </HStack>
            )}
          </Box>
        </>
      )}
    </Card.Root>
  );
};
