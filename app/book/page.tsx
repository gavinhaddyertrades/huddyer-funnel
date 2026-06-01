"use client";

import { useEffect, useRef, useCallback } from "react";
import Script from "next/script";
import ChartBackground from "@/components/v2/ChartBackground";

const CALENDLY_URL =
  "https://calendly.com/d/cvw9-y2d-3t5/huddyer-trades-mentorship-call?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0a0a0a&text_color=f2ede6&primary_color=c9a84c";

type CalendlyPrefill = {
  name?: string;
  email?: string;
  customAnswers?: Record<string, string>;
};

type CalendlyGlobal = {
  initInlineWidget: (opts: {
    url: string;
    parentElement: HTMLElement;
    prefill?: CalendlyPrefill;
  }) => void;
};

export default function BookPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fire Lead event once on mount and persist user data for /confirmed
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const email = p.get("email") ?? "";
    const phone = p.get("phone") ?? "";
    const first = p.get("first") ?? "";
    const last  = p.get("last")  ?? "";
    sessionStorage.setItem("userData", JSON.stringify({ email, phone, first, last }));

    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "Lead", { currency: "USD", value: 0 });
  }, []);

  const initCalendly = useCallback(() => {
    const cal = (window as Window & { Calendly?: CalendlyGlobal }).Calendly;
    if (!cal || !containerRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const email     = params.get("email") ?? "";
    const phone     = params.get("phone") ?? "";
    const firstName = params.get("first") ?? "";
    const lastName  = params.get("last")  ?? "";
    const name      = `${firstName} ${lastName}`.trim();

    // Use prefill object (not URL params) so fields are pre-filled but not
    // locked — locked fields render in primary_color (gold), prefill stays black.
    const prefill: CalendlyPrefill = {};
    if (name)  prefill.name  = name;
    if (email) prefill.email = email;
    if (phone) prefill.customAnswers = { a1: phone };

    cal.initInlineWidget({
      url:           CALENDLY_URL,
      parentElement: containerRef.current,
      prefill,
    });
  }, []);

  // Fallback: if the script was already cached and fired before this component
  // mounted, initCalendly won't be called via onLoad — so we check here too.
  useEffect(() => {
    const cal = (window as Window & { Calendly?: CalendlyGlobal }).Calendly;
    if (cal) initCalendly();
  }, [initCalendly]);

  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: "#0A0A0A", position: "relative" }}
    >
      <ChartBackground />
      {/* Header */}
      <div className="w-full text-center px-5 pt-16 pb-10">
        <p
          className="font-body text-xs uppercase tracking-widest mb-4"
          style={{ color: "#888" }}
        >
          Application Received
        </p>
        <h1
          className="font-display leading-none mb-4"
          style={{
            fontSize: "clamp(36px, 7vw, 80px)",
            color: "#F2EDE6",
            letterSpacing: "0.02em",
          }}
        >
          NOW PICK YOUR{" "}
          <span className="gold-text-gradient">CALL TIME.</span>
        </h1>
        <p
          className="font-body max-w-md mx-auto leading-relaxed"
          style={{
            fontSize: "clamp(14px, 2vw, 16px)",
            color: "#999",
          }}
        >
          Your application is in. Select a time below and a member of
          Hudson&apos;s team will be on the call to walk you through next steps.
        </p>

        {/* Divider */}
        <div
          className="mx-auto mt-8"
          style={{
            height: 1,
            maxWidth: 480,
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
          }}
        />
      </div>

      {/* Calendly Embed — initialised via JS so prefill can be applied */}
      <div className="w-full max-w-3xl px-4 pb-20">
        <div
          ref={containerRef}
          className="w-full rounded-2xl overflow-hidden"
          style={{ minWidth: 320, height: 700, background: "#0A0A0A" }}
        />
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
          onLoad={initCalendly}
        />
      </div>
    </main>
  );
}
