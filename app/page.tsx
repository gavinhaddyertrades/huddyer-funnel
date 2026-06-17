"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const TF_ID = "01KVAVCAYFG225A8XWNKD7SZYC";

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
  // Typeform div is NOT in the DOM on load — only injected on CTA click
  const [tfMounted, setTfMounted] = useState(false);
  const scriptReadyRef = useRef(false);
  const clickPendingRef = useRef(false);

  useEffect(() => {
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "ViewContent", {
      content_name: "Home Capture Page",
    });
  }, []);

  // When the div mounts, Typeform's embed.js should detect it via MutationObserver
  // and auto-open the form. We also poll for the sidetab button as a fallback.
  useEffect(() => {
    if (!tfMounted) return;

    const tryClick = (attempts = 0) => {
      const btn = document.querySelector<HTMLElement>(
        ".tf-v1-sidetab__button, .tf-v1-widget, [class*='tf-v1-sidetab'] button"
      );
      if (btn) {
        btn.click();
      } else if (attempts < 15) {
        setTimeout(() => tryClick(attempts + 1), 200);
      }
    };

    // Give embed.js a moment to detect the new div
    setTimeout(() => tryClick(), 300);
  }, [tfMounted]);

  function openForm() {
    if (!tfMounted) {
      // First click — mount the div (triggers Typeform initialisation)
      setTfMounted(true);
    } else {
      // Subsequent clicks — find and click the sidetab button directly
      const btn = document.querySelector<HTMLElement>(
        ".tf-v1-sidetab__button, .tf-v1-widget, [class*='tf-v1-sidetab'] button"
      );
      btn?.click();
    }
  }

  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      {/* Script loaded eagerly so it's ready when user clicks */}
      <Script
        src="//embed.typeform.com/next/embed.js"
        strategy="afterInteractive"
        onReady={() => { scriptReadyRef.current = true; }}
      />

      {/* Hide Typeform's floating sidetab button — we trigger the popup ourselves */}
      <style>{`
        .tf-v1-sidetab { opacity: 0 !important; pointer-events: none !important; }
      `}</style>

      {/* Typeform anchor — only added to DOM when CTA is clicked */}
      {tfMounted && <div data-tf-live={TF_ID} />}

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
          onClick={openForm}
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
