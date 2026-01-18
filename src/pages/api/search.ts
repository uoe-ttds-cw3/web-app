import type { NextApiRequest, NextApiResponse } from "next";

const API_BASE = process.env.API_BASE || "http://kotegawa.org:41592";

export type SearchResultItem = {
  submission_number: string;
  device_name: string;
  sponsor: string;
  relevance_score: number;
  snippet: string | null;
  product_code: string | null;
  panel: string | null;
  decision: string | null;
  decision_date: string | null;
};

export type QueryDebugInfo = {
  original_query: string;
  processed_terms: string[];
  phrases_detected: string[][];
  proximity_constraints: string[];
  required_terms: string[];
  excluded_terms: string[];
  is_boolean_query: boolean;
  stemming_applied: boolean;
  stopwords_removed: boolean;
  bm25_candidates: number;
  dense_candidates: number;
  filtered_by_constraints: number;
  retrieval_time_ms: number;
};

export type SearchResponse = {
  results: SearchResultItem[];
  total_results: number;
  debug_info: QueryDebugInfo | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | { error: string }>
) {
  const { q, limit = "10", panel, product_code, decision } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  const params = new URLSearchParams({
    q,
    limit: String(limit),
  });

  if (panel && typeof panel === "string") params.append("panel", panel);
  if (product_code && typeof product_code === "string")
    params.append("product_code", product_code);
  if (decision && typeof decision === "string")
    params.append("decision", decision);

  try {
    const response = await fetch(`${API_BASE}/api/search?${params.toString()}`);

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend error:", response.status, text);
      return res.status(response.status).json({ error: text });
    }

    const data: SearchResponse = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Failed to fetch search results" });
  }
}
