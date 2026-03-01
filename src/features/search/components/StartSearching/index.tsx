import { Center, Icon, VStack, Text, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PiStethoscopeDuotone } from "react-icons/pi";
import posthog from "posthog-js";

type StartSearchingProps = {
  onSuggest?: (suggestion: string) => void;
};

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  anesthesiology: ["anesthesia machine", "ventilator"],
  cardiovascular: ["pacemaker", "stent", "cardiac monitor"],
  chemistry: ["clinical chemistry analyzer", "blood glucose meter"],
  dental: ["dental handpiece"],
  ent: ["hearing aid", "otoscope"],
  gastro_urology: ["endoscope", "ureteral stent", "PVC urinary catheter"],
  surgery: ["surgical instrument", "surgical mesh"],
  hospital: ["hospital bed", "wheelchair"],
  hematology: ["hematology analyzer"],
  immunology: ["PCR instrument", "rapid diagnostic test kit"],
  microbiology: ["culture medium"],
  neurology: ["EEG machine", "nerve stimulator"],
  obgyn: ["fetal monitor"],
  ophthalmic: ["slit lamp"],
  orthopedic: ["joint prosthesis", "spinal fixation device"],
  pathology: ["tissue processor"],
  physical_medicine: ["ultrasound therapy device"],
  radiology: ["X-ray machine", "MRI machine"],
};

const SUGGESTION_POOL = Object.values(CATEGORY_SUGGESTIONS).flat();

const SUGGESTION_COUNT = 8;

function pickRandomSuggestions() {
  const shuffled = [...SUGGESTION_POOL];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, SUGGESTION_COUNT);
}

export const StartSearching = ({ onSuggest }: StartSearchingProps) => {
  const [suggestions, setSuggestions] = useState(() =>
    SUGGESTION_POOL.slice(0, SUGGESTION_COUNT),
  );

  useEffect(() => {
    setSuggestions(pickRandomSuggestions());
  }, []);

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
              backgroundColor="brand.accentBg"
              color="brand.primary"
              fontSize="sm"
              cursor="pointer"
              _hover={{ backgroundColor: "brand.accentHover" }}
            >
              {suggestion}
            </Box>
          ))}
        </Box>
      </VStack>
    </Center>
  );
};
