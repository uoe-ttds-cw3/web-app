import { useState } from "react";
import {
  Device,
  DeviceSummaryCard,
} from "@/features/search/components/DeviceSummaryCard";
import { ResultsHeader } from "@/features/search/components/ResultsHeader";
import { NavBar } from "@/features/search/components/NavBar";
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
  const [selectedCategory, setSelectedCategory] = useState<string>();

  return (
    <div>
      <SearchForm />
      <ResultsHeader numResults={results.length} />
      <NavBar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <Stack>
        {results.map((device) => (
          <DeviceSummaryCard device={device} />
        ))}
      </Stack>
    </div>
  );
}
