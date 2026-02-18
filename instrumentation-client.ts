// posthog client-side initialization for next.js
import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  // include the defaults option as required by posthog
  defaults: "2026-01-30",
  // enables capturing unhandled exceptions via error tracking
  capture_exceptions: true,
  // turn on debug in development mode
  debug: process.env.NODE_ENV === "development",
});
