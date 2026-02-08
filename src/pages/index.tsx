import {
  Device,
  DeviceSummaryCard,
} from "@/features/search/components/DeviceSummaryCard";
import { ResultsHeader } from "@/features/search/components/ResultsHeader";
import { SearchForm } from "@/features/search/components/SearchForm";
import { Stack } from "@chakra-ui/react";

const FAKE: Device[] = [
  {
    id: "K123",
    name: "Device A",
    manufacturer: "Epson",
    date: "2026-01-01",
    panel: "Cardiovascular",
    pCode: "LIW",
    recalls: 3,
    availability: true,
  },
];

export default function Home() {
  const results = FAKE;

  return (
    <div>
      <SearchForm />
      <ResultsHeader numResults={results.length} />
      <Stack>
        {results.map((device) => (
          <DeviceSummaryCard device={device} />
        ))}
      </Stack>
    </div>
  );
}
