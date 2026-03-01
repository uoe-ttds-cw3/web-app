import {
  Box,
  Text,
  Heading,
  Grid,
  Badge,
  Separator,
  Card,
  HStack,
  Skeleton,
} from "@chakra-ui/react";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  Node,
  Edge,
} from "recharts";
import {
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType,
  type NodeTypes,
} from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import posthog from "posthog-js";
import { DeviceDescriptionSection } from "./DeviceDescriptionSection";
import { DeviceHeader } from "./DeviceHeader";
import { DeviceFeatureSignals } from "./DeviceFeatureSignals";
import { DeviceLineageSection } from "./DeviceLineageSection";
import { DeviceMetadata } from "./DeviceMetadata";
import { DeviceSafetyOverview } from "./DeviceSafetyOverview";
import { DeviceSummarySection } from "./DeviceSummarySection";
import { IndicationsForUseSection } from "./IndicationsForUseSection";
import { useSearch } from "@/lib/queries/useSearch";
import type {
  DeviceLookupResponse,
  LineageResponse,
  SafetyProfileResponse,
  DeviceSafetyData,
} from "@/lib/api/types";

type DeviceDetailedProps = {
  device: DeviceLookupResponse;
  lineage: LineageResponse | null;
  safety: SafetyProfileResponse | null;
  deviceSafety: DeviceSafetyData | null;
};

// custom node component for the lineage graph
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
  deviceSafety,
}: DeviceDetailedProps) => {
  const router = useRouter();
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showFullIfu, setShowFullIfu] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // fetch related devices from same manufacturer
  const { data: manufacturerDevices, isLoading: isLoadingManufacturer } =
    useSearch(device.sponsor || "", { limit: 6 });

  // fetch similar devices with same product code using filter, not free-text
  const { data: similarDevices, isLoading: isLoadingSimilar } = useSearch(
    device.device_name || "",
    { limit: 6, product_code: device.product_code || undefined },
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
    if (
      !lineage ||
      (lineage.direct_predicates.length === 0 &&
        lineage.direct_citations.length === 0)
    ) {
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
  }, [lineage, device.submission_number]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // compute pan bounds so users can't scroll into the void
  const translateExtent = useMemo((): [[number, number], [number, number]] => {
    if (initialNodes.length === 0)
      return [
        [-200, -200],
        [200, 200],
      ];
    const pad = 200;
    const xs = initialNodes.map((n) => n.position.x);
    const ys = initialNodes.map((n) => n.position.y);
    return [
      [Math.min(...xs) - pad, Math.min(...ys) - pad],
      [Math.max(...xs) + 300 + pad, Math.max(...ys) + 100 + pad],
    ];
  }, [initialNodes]);

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
    [router, device.submission_number, device.device_name],
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
      padding={{ base: "16px", md: "24px" }}
      borderRadius="12px"
      maxWidth="1200px"
      borderWidth="1px"
      borderColor="ui.border"
    >
      <DeviceHeader device={device} deviceSafety={deviceSafety} />

      <Separator marginY="16px" />

      <DeviceMetadata device={device} formatDate={formatDate} />

      {/* feature flags */}
      <Separator marginY="16px" />
      <DeviceFeatureSignals device={device} />

      {/* indications for use */}
      {device.indications_for_use && (
        <>
          <Separator marginY="16px" />
          <IndicationsForUseSection
            indicationsForUse={device.indications_for_use}
            showFull={showFullIfu}
            onToggle={() => setShowFullIfu(!showFullIfu)}
          />
        </>
      )}

      {/* device description */}
      {device.device_description && (
        <>
          <Separator marginY="16px" />
          <DeviceDescriptionSection
            deviceDescription={device.device_description}
            showFull={showFullDescription}
            onToggle={() => setShowFullDescription(!showFullDescription)}
          />
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
          <DeviceSummarySection
            usefulSummary={usefulSummary}
            displaySummary={displaySummary || usefulSummary}
            showFullSummary={showFullSummary}
            onToggle={() => setShowFullSummary(!showFullSummary)}
          />
        </>
      )}

      {/* lineage section */}
      {lineage && (
        <>
          <Separator marginY="16px" />
          <DeviceLineageSection
            lineage={lineage}
            device={device}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            translateExtent={translateExtent}
          />
        </>
      )}

      {/* device-specific safety section */}
      {deviceSafety &&
        (deviceSafety.event_count > 0 || deviceSafety.recall_count > 0) && (
          <>
            <Separator marginY="16px" />
            <DeviceSafetyOverview
              device={device}
              deviceSafety={deviceSafety}
              formatDate={formatDate}
              formatNumber={formatNumber}
            />
          </>
        )}

      {/* product-code safety section (aggregate for all devices with this product code) */}
      {safety && (
        <>
          <Separator marginY="16px" />
          <Box>
            <Heading size="md" color="brand.primary" marginBottom="4px">
              {deviceSafety
                ? `All ${device.product_code} Devices`
                : "Safety Data"}
            </Heading>
            {deviceSafety && (
              <Text fontSize="xs" color="ui.textMuted" marginBottom="12px">
                Aggregate safety data across all devices with product code{" "}
                {device.product_code}
              </Text>
            )}
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
                            <RechartsTooltip />
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
                <Text color="black" marginBottom="4px">
                  {safety.most_recent_recall_date}
                </Text>
              </Box>
            )}
            {safety.recent_recalls && safety.recent_recalls.length > 0 && (
              <Box marginTop="12px">
                <Text
                  color="brand.primary"
                  fontWeight="bold"
                  marginBottom="8px"
                >
                  Recent Recalls:
                </Text>
                {safety.recent_recalls.slice(0, 5).map((recall) => (
                  <Box
                    key={recall.event_number}
                    padding="8px 12px"
                    marginBottom="8px"
                    borderRadius="6px"
                    borderWidth="1px"
                    borderColor="ui.border"
                    backgroundColor="ui.surface"
                  >
                    <HStack justifyContent="space-between" marginBottom="4px">
                      <Text fontSize="sm" fontWeight="bold" color="black">
                        {recall.event_number}
                      </Text>
                      {recall.status && (
                        <Badge
                          colorPalette={
                            recall.status.toLowerCase().includes("completed")
                              ? "green"
                              : recall.status
                                    .toLowerCase()
                                    .includes("terminated")
                                ? "gray"
                                : "yellow"
                          }
                          variant="subtle"
                          fontSize="xs"
                        >
                          {recall.status}
                        </Badge>
                      )}
                    </HStack>
                    {recall.reason && (
                      <Text fontSize="sm" color="ui.textMuted" lineClamp={2}>
                        {recall.reason}
                      </Text>
                    )}
                    {recall.firm && (
                      <Text fontSize="xs" color="ui.textMuted" marginTop="4px">
                        {recall.firm}
                        {recall.date_initiated
                          ? ` · ${formatDate(recall.date_initiated)}`
                          : ""}
                      </Text>
                    )}
                  </Box>
                ))}
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
                  <Skeleton
                    key={i}
                    height="120px"
                    minWidth="220px"
                    borderRadius="8px"
                  />
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
                      router.push(
                        `/devices/${relatedDevice.submission_number}`,
                      );
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
                  <Skeleton
                    key={i}
                    height="120px"
                    minWidth="220px"
                    borderRadius="8px"
                  />
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
                      router.push(
                        `/devices/${relatedDevice.submission_number}`,
                      );
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
