import type { NextApiRequest, NextApiResponse } from "next";
import type { SearchResponse } from "@/lib/api/types";

const API_BASE = process.env.API_BASE || "http://kotegawa.org:41592";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | { error: string }>
) {
  const {
    q,
    limit = "10",
    offset,
    panel,
    product_code,
    decision,
    device_class,
    date_from,
    date_to,
    use_expansion,
    use_pagerank_boost,
    use_stemming,
    use_hybrid,
    remove_stopwords,
    pagerank_weight,
    include_facets,
    sort_by
  } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  const params = new URLSearchParams({
    q,
    limit: String(limit),
  });

  if (offset && typeof offset === "string") params.append("offset", offset);
  if (panel && typeof panel === "string") params.append("panel", panel);
  if (product_code && typeof product_code === "string")
    params.append("product_code", product_code);
  if (date_from && typeof date_from === "string")
    params.append("date_from", date_from);
  if (date_to && typeof date_to === "string")
    params.append("date_to", date_to);
  if (decision && typeof decision === "string")
    params.append("decision", decision);
  if (device_class && typeof device_class === "string")
    params.append("device_class", device_class);
  if (use_expansion === "true")
    params.append("use_expansion", "true");
  if (use_pagerank_boost === "true")
    params.append("use_pagerank_boost", "true");
  if (use_stemming === "false")
    params.append("use_stemming", "false");
  if (use_hybrid === "false")
    params.append("use_hybrid", "false");
  if (remove_stopwords === "false")
    params.append("remove_stopwords", "false");
  if (pagerank_weight && typeof pagerank_weight === "string")
    params.append("pagerank_weight", pagerank_weight);
  if (include_facets === "true")
    params.append("include_facets", "true");
  if (sort_by && typeof sort_by === "string")
    params.append("sort_by", sort_by);

  try {
    const response = await fetch(`${API_BASE}/api/search?${params.toString()}`);

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend error:", response.status, text);
      return res.status(response.status).json({ error: text });
    }

    const data: SearchResponse = await response.json();

    // transform null fields to defaults
    const transformedData: SearchResponse = {
      ...data,
      results: data.results.map(result => ({
        ...result,
        snippet: result.snippet ?? '',
        product_code: result.product_code ?? '',
        panel: result.panel ?? '',
        panel_code: result.panel_code ?? '',
        decision: result.decision ?? '',
        decision_code: result.decision_code ?? '',
        decision_date: result.decision_date ?? '',
        device_class: result.device_class ?? '',
        indications_for_use: result.indications_for_use ?? null,
        device_description: result.device_description ?? null,
        materials: result.materials ?? [],
        standards_referenced: result.standards_referenced ?? [],
        has_clinical_data: result.has_clinical_data ?? false,
        has_sterilization: result.has_sterilization ?? false,
        has_biocompatibility: result.has_biocompatibility ?? false,
        has_software: result.has_software ?? false,
        has_electrical_safety: result.has_electrical_safety ?? false,
      })),
    };

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Failed to fetch search results" });
  }
}
