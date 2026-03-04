import type { NextApiRequest, NextApiResponse } from "next";
import { apiFetch } from "@/lib/api/fetchWithFallback";

export type PanelItem = {
  code: string;
  name: string;
  device_count: number;
};

export type PanelsResponse = {
  panels: PanelItem[];
  total_panels: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PanelsResponse | { error: string }>,
) {
  try {
    const response = await apiFetch(`/api/classification/panels`);

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend error:", response.status, text);
      return res.status(response.status).json({ error: text });
    }

    const data: PanelsResponse = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Panels fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch panels" });
  }
}
