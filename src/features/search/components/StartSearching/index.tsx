import { Center, Icon, VStack, Text, Box } from "@chakra-ui/react";
import { PiStethoscopeDuotone } from "react-icons/pi";
import posthog from "posthog-js";

type StartSearchingProps = {
  onSuggest?: (suggestion: string) => void;
  selectedCategory?: string;
};


// 73. Anesthesiology – Part 868
const anesthesiologyDevices: string[] = [
  "anesthesia machine",
  "ventilator",
  "patient monitor",
  "infusion pump",
  "endotracheal tube"
];

// 74. Cardiovascular – Part 870
const cardiovascularDevices: string[] = [
  "pacemaker",
  "implantable cardioverter-defibrillator",
  "stent",
  "heart-lung bypass machine",
  "cardiac monitor"
];

// 75. Chemistry – Part 862
const chemistryDevices: string[] = [
  "clinical chemistry analyzer",
  "blood glucose meter",
  "electrolyte analyzer",
  "reagent kit",
  "spectrophotometer"
];

// 76. Dental – Part 872
const dentalDevices: string[] = [
  "dental handpiece",
  "dental chair",
  "intraoral camera",
  "dental X-ray machine",
  "orthodontic device"
];

// 77. Ear, Nose, and Throat – Part 874
const entDevices: string[] = [
  "hearing aid",
  "audiometer",
  "endoscope",
  "otoscope",
  "cochlear implant"
];

// 78. Gastroenterology and Urology – Part 876
const gastroDevices: string[] = [
  "endoscope",
  "ureteral stent",
  "dialysis machine",
  "biopsy instrument",
  "laparoscopic surgical instrument"
];

// 79. General and Plastic Surgery – Part 878
const surgeryDevices: string[] = [
  "surgical instrument",
  "electrosurgical device",
  "suture",
  "implant",
  "wound dressing"
];

// 80. General Hospital – Part 880
const hospitalDevices: string[] = [
  "hospital bed",
  "wheelchair",
  "infusion pump",
  "patient monitor",
  "disposable medical supply"
];

// 81. Hematology – Part 864
const hematologyDevices: string[] = [
  "blood collection tube",
  "hematology analyzer",
  "blood transfusion set",
  "coagulation analyzer",
  "centrifuge"
];

// 82. Immunology – Part 866
const immunologyDevices: string[] = [
  "ELISA kit",
  "PCR instrument",
  "culture medium",
  "incubator",
  "rapid diagnostic test kit"
];

// 83. Microbiology – Part 866
const microbiologyDevices: string[] = [
  "ELISA kit",
  "PCR instrument",
  "culture medium",
  "incubator",
  "rapid diagnostic test kit"
];

// 84. Neurology – Part 882
const neurologyDevices: string[] = [
  "EEG machine",
  "nerve stimulator",
  "deep brain stimulator",
  "EMG equipment",
  "neuroimaging device"
];

// 85. Obstetrical and Gynecological – Part 884
const obgynDevices: string[] = [
  "fetal monitor",
  "ultrasound machine",
  "delivery bed",
  "contraceptive device",
  "surgical instrument"
];

// 86. Ophthalmic – Part 886
const ophthalmicDevices: string[] = [
  "slit lamp",
  "ophthalmoscope",
  "contact lens",
  "visual field analyzer",
  "phacoemulsification machine"
];

// 87. Orthopedic – Part 888
const orthopedicDevices: string[] = [
  "joint prosthesis",
  "orthopedic plate",
  "cast",
  "bone drill",
  "spinal fixation device"
];

// 88. Pathology – Part 864
const pathologyDevices: string[] = [
  "histology instrument",
  "tissue processor",
  "staining kit",
  "microscope",
  "automated slide stainer"
];

// 89. Physical Medicine – Part 890
const physicalMedicineDevices: string[] = [
  "ultrasound therapy device",
  "electrical stimulation device",
  "rehabilitation exercise equipment",
  "orthotic device",
  "wheelchair"
];

// 90. Radiology – Part 892
const radiologyDevices: string[] = [
  "X-ray machine",
  "CT scanner",
  "MRI machine",
  "ultrasound device",
  "radiographic detector"
];

// 91. Toxicology – Part 862
const toxicologyDevices: string[] = [
  "blood toxicology analyzer",
  "urine drug test kit",
  "breath analyzer",
  "chemical reagent kit",
  "immunoassay analyzer"
];

const panelDevices: Record<string, string[]> = {
  "AN": anesthesiologyDevices,
  "CV": cardiovascularDevices,
  "CH": chemistryDevices,
  "DE": dentalDevices,
  "EN": entDevices,
  "GU": gastroDevices,
  "SU": surgeryDevices,
  "HO": hospitalDevices,
  "PA": pathologyDevices,
  "HE": hematologyDevices,
  "IM": immunologyDevices,
  "MI": microbiologyDevices,       // microbiology is also 866
  "NE": neurologyDevices,
  "OB": obgynDevices,
  "OP": ophthalmicDevices,
  "OR": orthopedicDevices,
  "PM": physicalMedicineDevices,
  "RA": radiologyDevices,
};

export const StartSearching = ({ onSuggest, selectedCategory }: StartSearchingProps) => {
  // Get suggestions from the real API-loaded panels
  const suggestions =
    (selectedCategory && panelDevices[selectedCategory]) ||
    ["insulin pump", "pacemaker", "PVC urinary catheter"]; // fallback if no selection

  return (
    <Center padding="1rem">
      <VStack gap="4px">
        <Icon as={PiStethoscopeDuotone} fontSize="120px" color="gray.300" />
        <Text fontSize="lg" fontWeight="bold" color="brand.primary" mb="2">
          Start Searching!
        </Text>
        <Text fontSize="md" color="ui.textMuted" mb="3">
          Try searching for:
        </Text>
        <Box display="flex" gap="8px" justifyContent="center" flexWrap="wrap">
          {suggestions.map((suggestion) => (
            <Box
              key={suggestion}
              as="button"
              onClick={() => {
                // track suggestion click
                posthog.capture("search_suggestion_clicked", { suggestion });
                onSuggest?.(suggestion);
              }}
              marginTop="10px"
              padding="6px 16px"
              borderRadius="20px"
              backgroundColor="brand.greenBg"
              color="brand.primary"
              fontSize="sm"
              cursor="pointer"
              _hover={{ backgroundColor: "brand.greenHover" }}
            >
              {suggestion}
            </Box>
          ))}
        </Box>
      </VStack>
    </Center>
  );
};
