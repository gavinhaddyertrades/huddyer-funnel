"use client";

import Script from "next/script";

export default function BookPage() {
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
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
          }}
        />
      </div>

      {/* Calendly Embed */}
      <div className="w-full max-w-3xl px-4 pb-20">
        <div
          className="calendly-inline-widget w-full rounded-2xl overflow-hidden"
          data-url="https://calendly.com/1on1-mentorship/1-1-mentorship-call?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0a0a0a&text_color=f2ede6&primary_color=c9a84c"
          style={{ minWidth: 320, height: 700 }}
        />
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
      </div>
    </main>
  );
}
