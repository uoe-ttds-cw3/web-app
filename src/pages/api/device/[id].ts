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
    // step 1: fetch device details (needed for product_code)
    const deviceRes = await fetch(`${API_BASE}/api/device/${submissionNumber}?include_text=true`);
    if (!deviceRes.ok) {
      if (deviceRes.status === 404) {
        return res.status(404).json({ error: `Device ${submissionNumber} not found` });
      }
      return res.status(deviceRes.status).json({ error: "Failed to fetch device" });
    }
    const device: DeviceLookupResponse = await deviceRes.json();

    // step 2: fetch lineage and safety in parallel
    const [lineage, safety] = await Promise.all([
      // lineage fetch (may 404 if not in citation graph)
      fetch(`${API_BASE}/api/device/${submissionNumber}/lineage`)
        .then(res => res.ok ? res.json() as Promise<LineageResponse> : null)
        .catch(() => null),

      // safety fetch (may 503 if openfda down, needs product_code from device)
      device.product_code
        ? fetch(`${API_BASE}/api/device/${device.product_code}/safety`)
            .then(res => res.ok ? res.json() as Promise<SafetyProfileResponse> : null)
            .catch(() => null)
        : Promise.resolve(null),
    ]);

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
