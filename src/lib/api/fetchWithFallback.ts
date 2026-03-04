// sticky failover: tries primary with tight timeout, permanently switches
// to fallback on first failure. resets on server restart / redeploy.

const API_PRIMARY = process.env.API_BASE || "https://fda.kotegawa.org";
const API_FALLBACK = process.env.API_BASE_FALLBACK || "http://35.222.12.76:41592";
const PRIMARY_TIMEOUT = 1000;
const FALLBACK_TIMEOUT = 3000;

// module-level flag — persists across requests in the same server process
let useFallback = false;

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function apiFetch(path: string): Promise<Response> {
  // once primary has failed, skip it entirely
  if (useFallback) {
    return fetchWithTimeout(`${API_FALLBACK}${path}`, FALLBACK_TIMEOUT);
  }

  try {
    const res = await fetchWithTimeout(`${API_PRIMARY}${path}`, PRIMARY_TIMEOUT);
    if (res.ok || res.status < 500) return res;
    // 5xx — primary is sick, switch permanently
    console.warn(`primary returned ${res.status}, switching to fallback`);
  } catch {
    console.warn("primary unreachable, switching to fallback");
  }

  useFallback = true;
  return fetchWithTimeout(`${API_FALLBACK}${path}`, FALLBACK_TIMEOUT);
}
