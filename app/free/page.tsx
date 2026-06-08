"use client";

import Script from "next/script";
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

export default function FreePage() {
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

      <div className="max-w-2xl mx-auto px-5 pt-14 pb-20 flex flex-col items-center text-center gap-6">

        {/* Headline */}
        <h1
          className="font-display leading-none"
          style={{ fontSize: "clamp(34px, 7vw, 70px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          GET MY FULL{" "}
          <span className="gold-text-gradient">DISCRETIONARY TRADING MODEL</span>{" "}
          FOR FREE
        </h1>

        {/* Subheadline */}
        <p
          className="font-body leading-relaxed"
          style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#B0B0B0", maxWidth: 520 }}
        >
          The exact framework I used to get my student to{" "}
          <span style={{ color: "#D4AF37", fontWeight: 600 }}>$30K his FIRST month</span> trading futures.
        </p>

        {/* Social proof */}
        <p className="font-body text-sm" style={{ color: "#666" }}>
          Used by students who&apos;ve gone from zero to consistently profitable.
        </p>

        {/* Divider */}
        <div
          className="w-full"
          style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)" }}
        />

        {/* Typeform widget */}
        <div
          data-tf-widget="AH6Qxmyu"
          data-tf-opacity="0"
          data-tf-iframe-props="title=Free Trading Model"
          data-tf-auto-focus
          style={{ width: "100%", height: 400 }}
        />
        <Script src="//embed.typeform.com/next/embed.js" strategy="afterInteractive" />

      </div>
    </main>
  );
}
