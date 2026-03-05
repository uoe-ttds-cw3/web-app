import type { FacetField } from "@/lib/api/types";

export const FILTER_QUERY_KEY_BY_FACET_FIELD: Record<string, string> = {
  panel_code: "panel",
  decision_code: "decision",
};

export const getFacetDisplayValue = (
  facets: FacetField[] | null | undefined,
  facetField: string,
  value?: string,
) => {
  if (!value) return undefined;
  const facet = facets?.find((f) => f.field === facetField);
  const matchedValue = facet?.values.find((fv) => fv.value === value);
  return matchedValue?.label || matchedValue?.value || value;
};
