/**
 * TypeScript types matching backend Pydantic models
 * Reference: backend/src/api/models.py
 */

// Search result types
export interface SearchResultItem {
  submission_number: string;
  device_name: string;
  sponsor: string;
  relevance_score: number;
  snippet: string | null;
  product_code: string | null;
  panel: string | null;
  panel_code: string | null;
  decision: string | null;
  decision_code: string | null;
  decision_date: string | null;
  date_received: string | null;
  device_class: string | null;
  pagerank_score: number | null;
}

export interface QueryDebugInfo {
  original_query: string;
  processed_terms: string[];
  phrases_detected: string[][];
  proximity_constraints: string[];
  required_terms: string[];
  excluded_terms: string[];
  is_boolean_query: boolean;
  stemming_applied: boolean;
  stopwords_removed: boolean;
  expansion_enabled: boolean;
  pagerank_boost_applied: boolean;
  bm25_candidates: number;
  dense_candidates: number;
  filtered_by_constraints: number;
  retrieval_time_ms: number;
}

export interface FacetValue {
  value: string;
  count: number;
  label: string | null;
}

export interface FacetField {
  field: string;
  values: FacetValue[];
  total: number;
}

export interface ExpansionTermInfo {
  term: string;
  score: number;
  source: string;
}

export interface ExpansionInfo {
  original_query: string;
  expanded_query: string;
  expansion_applied: boolean;
  prf_terms: ExpansionTermInfo[];
  embedding_terms: ExpansionTermInfo[];
  total_expansion_terms: number;
}

export interface SearchResponse {
  results: SearchResultItem[];
  total_results: number;
  facets: FacetField[] | null;
  expansion_info: ExpansionInfo | null;
  debug_info: QueryDebugInfo | null;
}

// backend search options controlled by the advanced search panel
export interface BackendOptions {
  use_expansion: boolean;
  use_pagerank_boost: boolean;
  use_stemming: boolean;
  use_hybrid: boolean;
}

export const defaultBackendOptions: BackendOptions = {
  use_expansion: false,
  use_pagerank_boost: false,
  use_stemming: true,
  use_hybrid: true,
};

export interface SearchFilters {
  panel?: string;
  product_code?: string;
  decision?: string;
  device_class?: string;
  limit?: number;
  offset?: number;
  use_expansion?: boolean;
  use_pagerank_boost?: boolean;
  include_facets?: boolean;
  use_hybrid?: boolean;
  use_stemming?: boolean;
  remove_stopwords?: boolean;
  pagerank_weight?: number;
  date_from?: string;
  date_to?: string;
}

// Autocomplete types
export interface AutocompleteSuggestion {
  text: string;
  source: string;
  count: number;
}

export interface AutocompleteResponse {
  query: string;
  suggestions: AutocompleteSuggestion[];
  total_suggestions: number;
}

// Device lookup types
export interface DeviceLookupResponse {
  submission_number: string;
  device_name: string;
  sponsor: string;
  product_code: string | null;
  panel: string | null;
  decision: string | null;
  decision_date: string | null;
  date_received: string | null;
  summary_text: string | null;
}

// Lineage types
export interface LineageResponse {
  device: string;
  ancestors: string[];
  descendants: string[];
  direct_predicates: string[];
  direct_citations: string[];
  ancestor_count: number;
  descendant_count: number;
  pagerank: number | null;
}

// Panel types
export interface PanelItem {
  code: string;
  name: string;
  device_count: number;
}

export interface PanelsResponse {
  panels: PanelItem[];
  total_panels: number;
}

// Safety data types
export interface RecallInfo {
  event_number: string;
  product_description: string | null;
  reason: string | null;
  classification: string | null;
  status: string | null;
  date_initiated: string | null;
  firm: string | null;
}

export interface EventBreakdownResponse {
  counts: Record<string, number>;
  total: number;
}

export interface SafetyProfileResponse {
  product_code: string;
  recall_count: number;
  recent_recalls: RecallInfo[];
  adverse_event_count: number;
  event_breakdown: EventBreakdownResponse;
  most_recent_recall_date: string | null;
  last_updated: string;
  data_quality_note: string;
}

export interface SafetyComparisonResponse {
  product_codes: string[];
  profiles: Record<string, SafetyProfileResponse | null>;
  comparison_date: string;
  summary: Record<string, Record<string, unknown>>;
}

// Frontend display types (transformed from backend types)
export interface Device {
  id: string; // from submission_number
  name: string; // from device_name
  manufacturer: string; // from sponsor
  date: string; // from decision_date
  panel: string; // from panel
  pCode: string; // from product_code
  recalls: number; // default 0, populated later
  availability: boolean; // default true
  snippet: string;
  relevanceScore: number;
  deviceClass: string | null;
  pagerankScore: number | null;
}

/**
 * Transform backend SearchResultItem to frontend Device type
 */
export function transformSearchResult(item: SearchResultItem): Device {
  return {
    id: item.submission_number,
    name: item.device_name,
    manufacturer: item.sponsor,
    date: item.decision_date || '',
    panel: item.panel || '',
    pCode: item.product_code || '',
    recalls: 0, // populated later from safety data
    availability: true,
    snippet: item.snippet || '',
    relevanceScore: item.relevance_score,
    deviceClass: item.device_class,
    pagerankScore: item.pagerank_score,
  };
}
