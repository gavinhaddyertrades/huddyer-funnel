"use client";

import { useEffect } from "react";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C" />
        <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37" />
        <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C" />
        <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37" />
      </svg>
      <span className="font-display text-base" style={{ color: "#F2EDE6", letterSpacing: "0.12em" }}>
        HUDDYERTRADES ELITE
      </span>
    </div>
  );
}

export default function StartThankYouPage() {
  useEffect(() => {
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "Purchase", {
      value: 79.99,
      currency: "USD",
    });
  }, []);

  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>

      {/* Top bar */}
      <div
        className="flex items-center justify-center px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Logo />
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-20 pb-24 flex flex-col items-center text-center gap-6">

        {/* Checkmark */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.35)" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l6 6 10-10" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Headline */}
        <h1
          className="font-display leading-none"
          style={{ fontSize: "clamp(34px, 6vw, 64px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          YOU&apos;RE IN.
          <br />
          <span className="gold-text-gradient">SEE YOU AT 9:30.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="font-body leading-relaxed"
          style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#888", maxWidth: 460 }}
        >
          Welcome to the community. Check your email for access details — Hudson trades live every morning at 9:30 AM EST.
        </p>

      </div>
    </main>
  );
}
