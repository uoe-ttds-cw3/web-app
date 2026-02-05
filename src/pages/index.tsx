import {
  Device,
  DeviceSummaryCard,
} from "@/features/search/components/DeviceSummaryCard";
import { SearchForm } from "@/features/search/components/SearchForm";
import { Stack } from "@chakra-ui/react";

const FAKE: Device[] = [
  {
    id: "K123",
    name: "Device A",
    manufacturer: "Epson",
    date: "2026-01-01",
    panel: "Cardiovascular",
    recalls: 3,
  },
];

export default function Home() {
  const results = FAKE;

  return (
    <div>
      <SearchForm />
      <Stack>
        {results.map((device) => (
          <DeviceSummaryCard device={device} />
        ))}
      </Stack>
    </div>
  );
}
