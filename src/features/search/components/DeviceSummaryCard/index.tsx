import {
  Box,
  Link as ChakraLink,
  HStack,
} from "@chakra-ui/react";
import type { Device } from "@/lib/api/types";
import Link from "next/link";
import { ActionFooter } from "./ActionFooter";
import { FeatureBadges } from "./FeatureBadges";
import { MaterialsRow } from "./MaterialsRow";
import { MetadataRow } from "./MetadataRow";
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
      backgroundColor="ui.surface"
      padding={{ base: "4", md: "5" }}
      borderRadius="12px"
      border="1px solid"
      borderColor="ui.borderLight"
      marginBottom={{ base: "3", md: "4" }}
    >
      <TitleRow device={device} searchQuery={searchQuery} />

      <MetadataRow device={device} />

      <FeatureBadges device={device} />

      <MaterialsRow device={device} />

      <ChakraLink asChild color="brand.primary" mb="4">
        <Link href={`/devices/${device.id}`}>View all details &rarr;</Link>
      </ChakraLink>

      <SnippetPreview device={device} searchQuery={searchQuery} />

      <ActionFooter device={device} isSelected={isSelected} onToggle={onToggle} />
    </Box>
  );
};
