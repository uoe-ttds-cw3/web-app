import { Box, Text } from "@chakra-ui/react";
import type { BackendOptions } from "@/lib/api/types";
import { Tooltip } from "@/components/ui/Tooltip";

const OptionPill = ({
  label,
  active,
  onClick,
  tooltip,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tooltip?: string;
}) => {
  const pill = (
    <Box
      as="button"
      onClick={onClick}
      px="8px"
      py="3px"
      borderRadius="12px"
      fontSize="xs"
      cursor="pointer"
      bg={active ? "brand.accentBg" : "transparent"}
      color={active ? "brand.primary" : "ui.textMuted"}
      border="1px solid"
      borderColor={active ? "brand.primary" : "ui.borderLight"}
      transition="all 0.15s"
      _hover={{ opacity: 0.8 }}
      whiteSpace="nowrap"
    >
      {label}
    </Box>
  );

  return tooltip ? (
    <Tooltip
      content={tooltip}
      showArrow={false}
      interactive
      contentProps={{
        bg: "ui.background",
        color: "ui.text",
        px: 2,
        py: 1,
        borderRadius: "md",
      }}
    >
      {pill}
    </Tooltip>
  ) : (
    pill
  );
};

interface SearchOptionsSectionProps {
  options: BackendOptions;
  onToggleOption: (key: keyof BackendOptions) => void;
}

export const SearchOptionsSection = ({
  options,
  onToggleOption,
}: SearchOptionsSectionProps) => (
  <Box pt="12px" borderTop="1px solid" borderColor="ui.borderLight">
    <Text fontWeight="600" fontSize="sm" color="brand.primary" mb="6px">
      Search options
    </Text>
    <Box display="flex" flexWrap="wrap" gap="8px">
      <OptionPill
        label="query expansion"
        active={options.use_expansion}
        onClick={() => onToggleOption("use_expansion")}
        tooltip="Broadens search to include synonyms and related terms, e.g. 'heart attack' may also search for 'myocardial infarction'"
      />
      <OptionPill
        label="pagerank boost"
        active={options.use_pagerank_boost}
        onClick={() => onToggleOption("use_pagerank_boost")}
        tooltip="Boosts most influential or highly referenced records to the top of results."
      />
      <OptionPill
        label="stemming"
        active={options.use_stemming}
        onClick={() => onToggleOption("use_stemming")}
        tooltip="Matches different forms of a word, e.g. 'sterilizing' may also search for 'sterilize' and 'sterile'"
      />
      <OptionPill
        label="hybrid search"
        active={options.use_hybrid}
        onClick={() => onToggleOption("use_hybrid")}
        tooltip="Blends exact keyword matching with medical concept matching to find both exact terms and conceptually related devices. Automatically ranks the most relevant records to the top."
      />
    </Box>
  </Box>
);
