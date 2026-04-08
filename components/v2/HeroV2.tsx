"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const TYPEFORM_URL = "https://form.typeform.com/to/AH6Qxmyu";
const WISTIA_ID = "ht3wh0gzng";

function TradingBarsLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C" />
      <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37" />
      <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C" />
      <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37" />
    </svg>
  );
}

export default function HeroV2() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => el.classList.add("visible"), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
      <Script
        src={`https://fast.wistia.com/embed/${WISTIA_ID}.js`}
        strategy="afterInteractive"
        type="module"
      />

      <section
        ref={ref}
        className="section-fade min-h-screen flex flex-col"
        style={{ backgroundColor: "#0A0A0A" }}
      >
        {/* ── Top Bar ── */}
        <div
          className="flex items-center justify-between px-5 md:px-12 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2">
            <TradingBarsLogo />
            <span
              className="font-display text-base md:text-xl"
              style={{ color: "#F2EDE6", letterSpacing: "0.12em" }}
            >
              HUDDYERTRADES
            </span>
          </div>
          {/* Badge — desktop only */}
          <div className="badge-gold hidden md:inline-flex">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#C9A84C", boxShadow: "0 0 6px #C9A84C" }}
            />
            Applications Now Open
          </div>
        </div>

        {/* ── Centered Content ── */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-5 md:px-12 py-12 gap-7 max-w-4xl mx-auto w-full">

          {/* Headline + Subheading */}
          <div className="space-y-3">
            <h1
              className="font-display leading-none"
              style={{
                fontSize: "clamp(52px, 11vw, 130px)",
                color: "#F2EDE6",
                letterSpacing: "0.02em",
              }}
            >
              FUNDED{" "}
              <span className="gold-text-gradient">STARTS HERE.</span>
            </h1>
            <p
              className="font-body font-medium leading-snug"
              style={{
                fontSize: "clamp(15px, 2.5vw, 20px)",
                color: "#888",
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              The structured system Hudson uses to turn serious traders into
              consistently profitable, funded professionals.
            </p>
          </div>

          {/* VSL — Wistia */}
          <div
            className="w-full max-w-3xl rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <style>{`
              wistia-player[media-id='${WISTIA_ID}']:not(:defined) {
                background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${WISTIA_ID}/swatch');
                display: block;
                filter: blur(5px);
                padding-top: 56.25%;
              }
            `}</style>
            <div
              dangerouslySetInnerHTML={{
                __html: `<wistia-player media-id="${WISTIA_ID}" aspect="1.7777777777777777"></wistia-player>`,
              }}
            />
          </div>

          {/* CTA — full width on mobile, auto on desktop */}
          <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
            <a
              href={TYPEFORM_URL}
              className="btn-gold w-full sm:w-auto justify-center"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "16px", padding: "18px 48px" }}
            >
              Apply Now
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <p className="font-body text-xs" style={{ color: "#777" }}>
              Limited spots per cohort. Every application is reviewed.
            </p>
          </div>

        </div>
      </section>

    </>
  );
}
