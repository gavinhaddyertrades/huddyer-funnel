"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { useUTMUrl } from "@/hooks/useUTMUrl";

const TYPEFORM_BASE = "https://form.typeform.com/to/AH6Qxmyu";
const WISTIA_ID = "ht3wh0gzng";

function TradingBarsLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C" />
      <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37" />
      <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C" />
      <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37" />
    </svg>
  );
}

// Deterministic candlestick chart background
function ChartBackground() {
  const viewW = 1400;
  const viewH = 700;
  const count = 42;
  const spacing = viewW / (count + 1);
  const bodyW = 11;

  const candles = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const trend = 530 - t * 370;
    const noise = Math.sin(i * 2.1) * 22 + Math.cos(i * 3.8) * 12 + Math.sin(i * 5.3) * 8;
    const mid = trend + noise;

    const bodyH = 10 + Math.abs(Math.sin(i * 1.7)) * 28;
    const wickT = 6 + Math.abs(Math.cos(i * 2.4)) * 18;
    const wickB = 6 + Math.abs(Math.sin(i * 3.1)) * 14;

    const closeY = Math.cos(i * 2.9) > 0 ? mid - bodyH / 2 : mid + bodyH / 2;
    const openY  = Math.cos(i * 2.9) > 0 ? mid + bodyH / 2 : mid - bodyH / 2;
    const highY  = Math.min(openY, closeY) - wickT;
    const lowY   = Math.max(openY, closeY) + wickB;

    return { x: spacing * (i + 1), openY, closeY, highY, lowY };
  });

  return (
    <div id="chart-bg" style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      <style>{`
        @media (max-width: 767px) {
          #chart-bg { transform: translateY(-38%); }
        }
      `}</style>
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="goldGlow" cx="52%" cy="48%" r="58%">
            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.13" />
            <stop offset="55%"  stopColor="#C9A84C" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"    />
          </radialGradient>
          <linearGradient id="fadeH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="white" stopOpacity="0" />
            <stop offset="15%"  stopColor="white" stopOpacity="1" />
            <stop offset="85%"  stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="edgeFade">
            <rect width={viewW} height={viewH} fill="url(#fadeH)" />
          </mask>
        </defs>
        <rect width={viewW} height={viewH} fill="url(#goldGlow)" />
        <g mask="url(#edgeFade)" opacity="0.07">
          {candles.map((c, i) => (
            <g key={i} fill="#C9A84C" stroke="#C9A84C">
              <line x1={c.x} y1={c.highY} x2={c.x} y2={c.lowY} strokeWidth="1.5" />
              <rect
                x={c.x - bodyW / 2}
                y={Math.min(c.openY, c.closeY)}
                width={bodyW}
                height={Math.abs(c.closeY - c.openY) || 2}
                rx="1"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function HeroV2() {
  const typeformUrl  = useUTMUrl(TYPEFORM_BASE);
  const mobileLogoRef = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);

  // On mobile: position logo exactly halfway between top of viewport and top of heading
  useEffect(() => {
    function place() {
      if (window.innerWidth >= 768) return; // desktop: leave in-flow logo as-is
      const logo    = mobileLogoRef.current;
      const heading = headingRef.current;
      if (!logo || !heading) return;
      const headingTop = heading.getBoundingClientRect().top; // relative to viewport top
      const logoH      = logo.offsetHeight;
      // Center of logo should sit at headingTop / 2
      const top = Math.max(8, headingTop / 2 - logoH / 2);
      logo.style.top = `${top}px`;
    }

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  const logoMarkup = (
    <div className="flex items-center gap-2">
      <TradingBarsLogo />
      <span className="font-display text-lg" style={{ color: "#F2EDE6", letterSpacing: "0.12em" }}>
        HUDDYERTRADES
      </span>
    </div>
  );

  return (
    <>
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
      <Script
        src={`https://fast.wistia.com/embed/${WISTIA_ID}.js`}
        strategy="afterInteractive"
        type="module"
      />

      <section
        className="min-h-screen flex items-center justify-center px-5"
        style={{ backgroundColor: "#0A0A0A", paddingTop: 40, paddingBottom: 32, position: "relative" }}
      >
        <ChartBackground />

        {/* Mobile logo — absolutely positioned halfway between top and heading */}
        <div
          ref={mobileLogoRef}
          className="md:hidden"
          style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
        >
          {logoMarkup}
        </div>

        <div
          className="w-full flex flex-col items-center gap-5"
          style={{ maxWidth: 700, position: "relative", zIndex: 1 }}
        >

          {/* Desktop logo — in flow */}
          <div className="hidden md:flex items-center gap-2 mb-1">
            {logoMarkup}
          </div>

          {/* Headline */}
          <h1
            ref={headingRef}
            className="font-display leading-none text-center"
            style={{
              fontSize: "clamp(38px, 7.5vw, 76px)",
              color: "#F2EDE6",
              letterSpacing: "0.02em",
            }}
          >
            FROM INCONSISTENT TO{" "}
            <span className="gold-text-gradient">PROFITABLE IN 90 DAYS.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="font-body text-center leading-snug"
            style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "#777", maxWidth: 480 }}
          >
            A private mentorship built for{" "}
            <strong style={{ color: "#F2EDE6", fontWeight: 600 }}>serious traders</strong>{" "}
            who are done leaving money on the table.
          </p>

          {/* Video */}
          <div
            style={{
              border: "1px solid rgba(201,168,76,0.5)",
              borderRadius: 12,
              padding: 5,
              width: "100%",
            }}
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
              style={{ borderRadius: 8, overflow: "hidden" }}
              dangerouslySetInnerHTML={{
                __html: `<wistia-player media-id="${WISTIA_ID}" aspect="1.7777777777777777"></wistia-player>`,
              }}
            />
          </div>

          {/* CTA */}
          <a
            href={typeformUrl}
            className="btn-gold w-full justify-center"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "16px", padding: "14px 32px", maxWidth: 260 }}
          >
            Apply Now
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

        </div>
      </section>
    </>
  );
}
