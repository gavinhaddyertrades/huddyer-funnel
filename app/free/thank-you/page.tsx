"use client";

import { useEffect } from "react";
import ChartBackground from "@/components/v2/ChartBackground";

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

export default function FreeThankYouPage() {
  useEffect(() => {
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "Lead");
  }, []);

  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", position: "relative" }}>
      <ChartBackground />

      {/* Top bar */}
      <div
        className="flex items-center justify-center px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Logo />
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-14 pb-20 flex flex-col items-center text-center gap-8">

        {/* Headline */}
        <h1
          className="font-display leading-none"
          style={{ fontSize: "clamp(32px, 6vw, 64px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          CHECK YOUR INBOX —{" "}
          <span className="gold-text-gradient">THE VIDEO IS ON ITS WAY.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="font-body leading-relaxed"
          style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#B0B0B0", maxWidth: 480 }}
        >
          While you wait, here&apos;s what one student did with this exact framework:
        </p>

        {/* Gold quote card */}
        <div
          style={{
            border: "1px solid rgba(201,168,76,0.45)",
            borderRadius: 16,
            padding: "28px 32px",
            background: "rgba(201,168,76,0.05)",
            maxWidth: 540,
            width: "100%",
            textAlign: "left",
          }}
        >
          <p
            className="font-body leading-relaxed"
            style={{ fontSize: "clamp(15px, 2vw, 17px)", color: "#F2EDE6" }}
          >
            &ldquo;Carmine was funded within one week and got his first payout{" "}
            <span style={{ color: "#D4AF37", fontWeight: 600 }}>ONE month</span>{" "}inside Hudson&apos;s mentorship.&rdquo;
          </p>
        </div>

        {/* CTA line */}
        <p
          className="font-body leading-relaxed"
          style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "#888", maxWidth: 460 }}
        >
          If you&apos;re serious about trading futures consistently, this is your next step.
        </p>

      </div>
    </main>
  );
}
