"use client";

import { useEffect, useState } from "react";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/**
 * Returns a URL with UTM parameters forwarded from the current page URL.
 * Falls back to `baseUrl` unchanged on the server (no window).
 */
export function useUTMUrl(baseUrl: string): string {
  const [url, setUrl] = useState(baseUrl);

  useEffect(() => {
    const pageParams = new URLSearchParams(window.location.search);
    const dest = new URL(baseUrl);

    UTM_KEYS.forEach((key) => {
      const value = pageParams.get(key);
      if (value) dest.searchParams.set(key, value);
    });

    setUrl(dest.toString());
  }, [baseUrl]);

  return url;
}
