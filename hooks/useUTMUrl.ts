"use client";

import { useEffect, useState } from "react";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const HASH_KEYS = [
  "first_name",
  "email",
  "phone_number",
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

    const hashParams = new URLSearchParams();
    HASH_KEYS.forEach((key) => {
      const value = pageParams.get(key);
      if (value) hashParams.set(key, value);
    });
    // Typeform redirects with full_name instead of first_name — map it
    if (!hashParams.get("first_name")) {
      const fullName = pageParams.get("full_name");
      if (fullName) hashParams.set("first_name", fullName);
    }
    const hashStr = hashParams.toString();
    if (hashStr) dest.hash = hashStr;

    setUrl(dest.toString());
  }, [baseUrl]);

  return url;
}
