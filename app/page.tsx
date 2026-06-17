"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

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

export default function HomePage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "ViewContent", {
      content_name: "Home Capture Page",
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      {/* Typeform embed.js — loaded once */}
      <Script src="//embed.typeform.com/next/embed.js" strategy="afterInteractive" />

      {/* Overlay — always in DOM so embed.js initialises the widget on load */}
      <div
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.2s",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: 680, height: "85vh", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(201,168,76,0.3)" }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute", top: 12, right: 12, zIndex: 10,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
          {/* The actual Typeform live embed */}
          <div data-tf-live="01KVAVCAYFG225A8XWNKD7SZYC" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      {/* Top bar */}
      <div
        className="flex items-center justify-center px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Logo />
      </div>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-5 pt-20 pb-24 flex flex-col items-center text-center gap-8">
        <h1
          className="font-display leading-none"
          style={{ fontSize: "clamp(36px, 6.5vw, 72px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          The Exact Process I Use To Trade{" "}
          <span className="gold-text-gradient">Every Single Day.</span>
        </h1>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Blueprint 2.png"
          alt="Trading Blueprint"
          style={{ width: "100%", maxWidth: 600, borderRadius: 12, display: "block" }}
        />

        <button
          className="btn-gold"
          style={{ fontSize: "clamp(13px, 3.5vw, 16px)", padding: "clamp(13px, 2.5vw, 16px) clamp(28px, 5vw, 40px)", whiteSpace: "nowrap" }}
          onClick={() => setOpen(true)}
        >
          Learn My Trading Strategy
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Results section */}
      <section style={{ backgroundColor: "#0A0A0A", padding: "0 20px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", textAlign: "center", marginBottom: 12 }}>
            Real Results
          </p>
          <h2
            className="students-say-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 4vw, 48px)",
              color: "#F2EDE6",
              textAlign: "center",
              letterSpacing: "0.02em",
              lineHeight: 1,
              marginBottom: 56,
            }}
          >
            WHAT TRADERS DO WITH{" "}
            <span className="gold-text-gradient">THIS STRATEGY</span>
          </h2>
          <div className="masonry-grid">
            {[
              "IMG_3080","IMG_3081","IMG_3082","IMG_3083","IMG_3084","IMG_3085",
              "IMG_3086","IMG_3087","IMG_3088","IMG_3089","IMG_3090","IMG_3091",
              "IMG_3092","IMG_3093","IMG_3094","IMG_3095","IMG_3096",
            ].map((name) => (
              <div
                key={name}
                className={`masonry-item${name === "IMG_3085" ? " hide-mobile" : ""}`}
                style={{
                  breakInside: "avoid",
                  marginBottom: 16,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backgroundColor: "#1c1d22",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/testimonials/${name}.jpg`}
                  alt="Trader result"
                  style={{ width: "100%", display: "block" }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
