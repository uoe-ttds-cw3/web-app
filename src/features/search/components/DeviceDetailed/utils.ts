export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatDate(isoDate: string | null): string {
  if (!isoDate) return "N/A";

  try {
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export function extractUsefulSummary(text: string): string {
  const sectionPatterns = [
    /indications?\s+for\s+use/i,
    /device\s+description/i,
    /predicate\s+device/i,
    /intended\s+use/i,
    /summary\s+of\s+submission/i,
  ];

  for (const pattern of sectionPatterns) {
    const match = text.search(pattern);
    if (match !== -1) {
      return text.substring(match);
    }
  }

  const reMatch = text.search(/Re:\s*K\d/i);
  if (reMatch !== -1) {
    const afterRe = text.indexOf("\n", reMatch + 10);
    if (afterRe !== -1) {
      return text.substring(afterRe).trim();
    }
  }

  return text;
}
