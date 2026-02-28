import { Badge, HStack } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Device } from "@/lib/api/types";

export type FeatureBadgesProps = {
  device: Device;
};

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
};

const FEATURE_BADGE_CONFIG = [
  {
    key: "hasClinicalData" as const,
    label: "Clinical evidence",
    tooltip:
      "Detected from terms such as clinical study, trial, in-vivo, patient study, or human factors.",
  },
  {
    key: "hasSterilization" as const,
    label: "Sterilization",
    tooltip:
      "Detected from sterilization or sterility language in the submission text.",
  },
  {
    key: "hasBiocompatibility" as const,
    label: "Biocompatibility",
    tooltip:
      "Detected from biocompatibility testing terms such as ISO 10993, cytotoxicity, or sensitization.",
  },
  {
    key: "hasSoftware" as const,
    label: "Software lifecycle",
    tooltip:
      "Detected from software-related terms such as IEC 62304, firmware, validation, or cybersecurity.",
  },
  {
    key: "hasElectricalSafety" as const,
    label: "Electrical safety",
    tooltip:
      "Detected from electrical safety testing terms such as IEC 60601, EMC testing, or leakage current.",
  },
] satisfies Array<{
  key:
    | "hasClinicalData"
    | "hasSterilization"
    | "hasBiocompatibility"
    | "hasSoftware"
    | "hasElectricalSafety";
  label: string;
  tooltip: string;
}>;

export const FeatureBadges = ({ device }: FeatureBadgesProps) => {
  const hasFeatureBadges =
    device.hasClinicalData ||
    device.hasSterilization ||
    device.hasBiocompatibility ||
    device.hasSoftware ||
    device.hasElectricalSafety;

  if (!hasFeatureBadges) {
    return null;
  }

  return (
    <HStack gap="2" flexWrap="wrap">
      {FEATURE_BADGE_CONFIG.map((feature) => {
        if (!device[feature.key]) {
          return null;
        }

        return (
          <Tooltip
            key={feature.key}
            content={feature.tooltip}
            showArrow
            openDelay={200}
            contentProps={TOOLTIP_PROPS}
          >
            <Badge
              variant="outline"
              colorPalette="gray"
              fontSize="xs"
              cursor="help"
              padding="0 0.25rem"
            >
              {feature.label}
            </Badge>
          </Tooltip>
        );
      })}
    </HStack>
  );
};
