export const FEATURE_SIGNAL_CONFIG = [
  {
    summaryKey: "hasClinicalData" as const,
    detailedKey: "has_clinical_data" as const,
    label: "Clinical evidence",
    tooltip:
      "Detected from terms such as clinical study, trial, in-vivo, patient study, or human factors.",
  },
  {
    summaryKey: "hasSterilization" as const,
    detailedKey: "has_sterilization" as const,
    label: "Sterilization",
    tooltip:
      "Detected from sterilization or sterility language in the submission text.",
  },
  {
    summaryKey: "hasBiocompatibility" as const,
    detailedKey: "has_biocompatibility" as const,
    label: "Biocompatibility",
    tooltip:
      "Detected from biocompatibility testing terms such as ISO 10993, cytotoxicity, or sensitization.",
  },
  {
    summaryKey: "hasSoftware" as const,
    detailedKey: "has_software" as const,
    label: "Software lifecycle",
    tooltip:
      "Detected from software-related terms such as IEC 62304, firmware, validation, or cybersecurity.",
  },
  {
    summaryKey: "hasElectricalSafety" as const,
    detailedKey: "has_electrical_safety" as const,
    label: "Electrical safety",
    tooltip:
      "Detected from electrical safety testing terms such as IEC 60601, EMC testing, or leakage current.",
  },
] as const;
