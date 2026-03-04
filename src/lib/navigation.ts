import type { UrlObject } from "url";

export const SEARCH_RESULTS_RETURN_TO_KEY = "returnTo";

export const getSearchResultsHref = (
  value: string | string[] | undefined,
): string | null => {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate) {
    return null;
  }

  if (candidate === "/" || candidate.startsWith("/?")) {
    return candidate;
  }

  return null;
};

export const buildDeviceDetailsHref = (
  deviceId: string,
  searchResultsHref?: string | null,
): UrlObject => {
  const query: Record<string, string> = { id: deviceId };

  if (searchResultsHref) {
    query[SEARCH_RESULTS_RETURN_TO_KEY] = searchResultsHref;
  }

  return {
    pathname: "/devices/[id]",
    query,
  };
};
