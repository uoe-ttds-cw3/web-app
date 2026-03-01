import { Box } from "@chakra-ui/react";
import type { Device } from "@/lib/api/types";
import { ActionFooter } from "./ActionFooter";
import { MetadataRow } from "./MetadataRow";
import { SignalSummaryBox } from "./SignalSummaryBox";
import { SnippetPreview } from "./SnippetPreview";
import { TitleRow } from "./TitleRow";

type DeviceSummaryCardProps = {
  device: Device;
  searchQuery?: string;
  selectedDevices: Device[];
  onToggle: (device: Device) => void;
};

export const DeviceSummaryCard = ({
  device,
  selectedDevices,
  onToggle,
  searchQuery = "",
}: DeviceSummaryCardProps) => {
  const isSelected = selectedDevices.some((d) => d.id === device.id);

  return (
    <Box
      display="grid"
      gap={{ base: "3", md: "4" }}
      backgroundColor="ui.surface"
      padding={{ base: "3", md: "4" }}
      borderRadius="12px"
      border="1px solid"
      borderColor="ui.borderLight"
      boxShadow="sm"
      marginBottom={{ base: "3", md: "4" }}
    >
      <TitleRow device={device} searchQuery={searchQuery} />

      <MetadataRow device={device} />

      <SnippetPreview device={device} searchQuery={searchQuery} />

      <SignalSummaryBox device={device} />

      <ActionFooter
        device={device}
        isSelected={isSelected}
        onToggle={onToggle}
      />
    </Box>
  );
};
