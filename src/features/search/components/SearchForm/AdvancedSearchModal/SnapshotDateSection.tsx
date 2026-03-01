import { Box, Icon, Text } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";
import { DateBox } from "@/features/search/components/DateBox";

export const SnapshotDateSection = () => (
  <Box pt="12px" mt="12px" borderTop="1px solid" borderColor="ui.borderLight">
    <Box display="flex" alignItems="center" gap="6px" mb="10px">
      <Text fontWeight="600" fontSize="sm" color="brand.primary">
        Snapshot date
      </Text>
      <Tooltip
        content="Only include records available on or before the selected date."
        contentProps={{
          px: "12px",
          py: "10px",
          borderRadius: "12px",
          bg: "ui.surface",
          color: "ui.text",
          border: "1px solid",
          borderColor: "ui.borderLight",
          boxShadow: "md",
          maxW: "260px",
          fontSize: "sm",
          lineHeight: "1.4",
        }}
      >
        <Box as="span" display="inline-flex" alignItems="center">
          <Icon as={LuInfo} color="ui.textMuted" boxSize="3.5" />
        </Box>
      </Tooltip>
    </Box>
    <DateBox />
  </Box>
);
