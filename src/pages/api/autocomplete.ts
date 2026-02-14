import type { NextApiRequest, NextApiResponse } from "next";
import type { AutocompleteResponse } from "@/lib/api/types";

const API_BASE = process.env.API_BASE || "http://kotegawa.org:41592";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AutocompleteResponse | { error: string }>
) {
  const { q, limit = "10", source } = req.query;

  if (!q || typeof q !== "string" || q.length < 2) {
    return res.status(400).json({ error: "Query parameter 'q' must be at least 2 characters" });
  }

  const params = new URLSearchParams({ q, limit: String(limit) });
  if (source && typeof source === "string") params.append("source", source);

  try {
    const response = await fetch(`${API_BASE}/api/autocomplete?${params.toString()}`);

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend autocomplete error:", response.status, text);
      return res.status(response.status).json({ error: text });
    }

    const data: AutocompleteResponse = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Autocomplete error:", error);
    return res.status(500).json({ error: "Failed to fetch autocomplete suggestions" });
  }
}
