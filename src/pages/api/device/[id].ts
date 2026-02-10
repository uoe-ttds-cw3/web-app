import type { NextApiRequest, NextApiResponse } from "next";
import type { DeviceLookupResponse, LineageResponse, SafetyProfileResponse } from "@/lib/api/types";

const API_BASE = process.env.API_BASE || "http://kotegawa.org:41592";

type DevicePageData = {
  device: DeviceLookupResponse | null;
  lineage: LineageResponse | null;
  safety: SafetyProfileResponse | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DevicePageData | { error: string }>
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Device ID is required" });
  }

  const submissionNumber = id.toUpperCase();

  try {
    // Always fetch device details
    const deviceRes = await fetch(`${API_BASE}/api/device/${submissionNumber}?include_text=true`);
    if (!deviceRes.ok) {
      if (deviceRes.status === 404) {
        return res.status(404).json({ error: `Device ${submissionNumber} not found` });
      }
      return res.status(deviceRes.status).json({ error: "Failed to fetch device" });
    }
    const device: DeviceLookupResponse = await deviceRes.json();

    // Fetch lineage in parallel (may 404 if not in citation graph -- that's OK)
    let lineage: LineageResponse | null = null;
    try {
      const lineageRes = await fetch(`${API_BASE}/api/device/${submissionNumber}/lineage`);
      if (lineageRes.ok) {
        lineage = await lineageRes.json();
      }
    } catch {
      // Lineage unavailable, not critical
    }

    // Fetch safety data if product_code available (may 503 if OpenFDA is down -- that's OK)
    let safety: SafetyProfileResponse | null = null;
    if (device.product_code) {
      try {
        const safetyRes = await fetch(`${API_BASE}/api/device/${device.product_code}/safety`);
        if (safetyRes.ok) {
          safety = await safetyRes.json();
        }
      } catch {
        // Safety data unavailable, not critical
      }
    }

    // Provide defaults for null fields in device response
    const transformedDevice: DeviceLookupResponse = {
      ...device,
      product_code: device.product_code ?? '',
      panel: device.panel ?? '',
      decision: device.decision ?? '',
      decision_date: device.decision_date ?? '',
      summary_text: device.summary_text ?? '',
    };

    return res.status(200).json({
      device: transformedDevice,
      lineage,
      safety,
    });
  } catch (error) {
    console.error("Device lookup error:", error);
    return res.status(500).json({ error: "Failed to fetch device data" });
  }
}
