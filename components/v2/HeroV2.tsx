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


export default function HeroV2() {
  const typeformUrl  = useUTMUrl(TYPEFORM_BASE);
  const mobileLogoRef = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);

  // Fire ViewContent once on mount
  useEffect(() => {
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "ViewContent");
  }, []);

  // On mobile: position logo exactly halfway between top of viewport and top of heading.
  // Only re-run on WIDTH changes — iOS fires resize on every scroll as the URL bar
  // shows/hides (height change), which would cause the logo to jump mid-scroll.
  useEffect(() => {
    let lastWidth = window.innerWidth;

    function place() {
      if (window.innerWidth >= 768) return;
      const logo    = mobileLogoRef.current;
      const heading = headingRef.current;
      if (!logo || !heading) return;
      const headingTop = heading.getBoundingClientRect().top;
      const logoH      = logo.offsetHeight;
      // 0.65 instead of 0.5 moves the logo ~30% closer to the heading
      const top = Math.max(8, headingTop * 0.65 - logoH / 2);
      logo.style.top = `${top}px`;
    }

    function onResize() {
      const w = window.innerWidth;
      if (w === lastWidth) return; // height-only change (iOS URL bar) — ignore
      lastWidth = w;
      place();
    }

    place();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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
        className="flex items-center justify-center px-5 hero-section"
        style={{ backgroundColor: "#1a1810", paddingTop: 40, paddingBottom: 32, position: "relative", minHeight: "100svh" }}
      >
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
            <strong style={{ color: "#999", fontWeight: 700 }}>serious traders</strong>{" "}
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
            onClick={() => { (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("trackCustom", "ApplyNowClicked"); }}
          >
            Apply Now
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ backgroundColor: "#0A0A0A", padding: "80px 20px 100px" }} className="testimonials-section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Heading */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", textAlign: "center", marginBottom: 12 }}>
            Student Results
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 72px)",
              color: "#F2EDE6",
              textAlign: "center",
              letterSpacing: "0.02em",
              lineHeight: 1,
              marginBottom: 56,
            }}
          >
            WHAT MY{" "}
            <span className="gold-text-gradient">STUDENTS SAY</span>
          </h2>

          {/* Masonry-style grid */}
          <div
            style={{
              columns: "3 280px",
              columnGap: 16,
            }}
          >
            {[
              "IMG_3080","IMG_3081","IMG_3082","IMG_3083","IMG_3084","IMG_3085",
              "IMG_3086","IMG_3087","IMG_3088","IMG_3089","IMG_3090","IMG_3091",
              "IMG_3092","IMG_3093","IMG_3094","IMG_3095","IMG_3096",
            ].map((name) => (
              <div
                key={name}
                style={{
                  breakInside: "avoid",
                  marginBottom: 16,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/testimonials/${name}.jpg`}
                  alt="Student result"
                  style={{ width: "100%", display: "block" }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
