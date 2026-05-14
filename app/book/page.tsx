"use client";

import { useEffect, useRef, useCallback } from "react";
import Script from "next/script";

const CALENDLY_URL =
  "https://calendly.com/1on1-mentorship/1-1-mentorship-call?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0a0a0a&text_color=f2ede6&primary_color=c9a84c";

type CalendlyGlobal = {
  initInlineWidget: (opts: {
    url: string;
    parentElement: HTMLElement;
    prefill?: { email?: string; name?: string; smsReminderNumber?: string };
  }) => void;
};

export default function BookPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const initCalendly = useCallback(() => {
    const cal = (window as Window & { Calendly?: CalendlyGlobal }).Calendly;
    if (!cal || !containerRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const email     = params.get("email") ?? "";
    const firstName = params.get("first") ?? "";
    const lastName  = params.get("last")  ?? "";
    const phone     = params.get("phone") ?? "";

    cal.initInlineWidget({
      url: CALENDLY_URL,
      parentElement: containerRef.current,
      prefill: {
        email,
        name: `${firstName} ${lastName}`.trim(),
        smsReminderNumber: phone,
      },
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
      style={{ backgroundColor: "#0A0A0A" }}
    >
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
          style={{ minWidth: 320, height: 700 }}
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
