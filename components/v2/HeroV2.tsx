"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

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
      // 0.30 doubles the gap between logo bottom and heading vs the previous 0.65
      const top = Math.max(8, headingTop * 0.30);
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
        HUDDYERTRADES ELITE
      </span>
    </div>
  );

  return (
    <>

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
          style={{ maxWidth: 860, position: "relative", zIndex: 1 }}
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
              fontSize: "clamp(34px, 6.5vw, 66px)",
              color: "#F2EDE6",
              letterSpacing: "0.02em",
            }}
          >
            Trade Live With Hudson{" "}
            <span className="gold-text-gradient">Every Single Day.</span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(15px, 1.8vw, 18px)",
            color: "#a89880",
            textAlign: "center",
            lineHeight: 1.7,
            maxWidth: 600,
          }}>
            Watch Hudson&apos;s screen, see every setup, every entry, every exit, live in the markets every single day. Starting at just <strong style={{ color: "#F2EDE6" }}>$29.99/month.</strong>
          </p>

          {/* Hero image */}
          <div style={{ width: "100%", borderRadius: 12, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/trading-room-2.png"
              alt="The Trading Room"
              style={{ width: "100%", display: "block" }}
            />
          </div>

          {/* CTA */}
          <a
            href="/checkout"
            className="btn-gold w-full justify-center"
            style={{ fontSize: "16px", padding: "14px 32px", maxWidth: 260 }}
            onClick={() => {
              (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("trackCustom", "GetAccessClicked");
            }}
          >
            Join Now
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ backgroundColor: "#1a1810", padding: "80px 20px 40px" }} className="testimonials-section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Heading */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", textAlign: "center", marginBottom: 12 }}>
            Student Results
          </p>
          <h2
            className="students-say-heading"
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
                  alt="Student result"
                  style={{ width: "100%", display: "block" }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Logo lockup */}
      <section style={{ backgroundColor: "#1a1810", padding: "48px 20px 64px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {logoMarkup}
        </div>
      </section>
    </>
  );
}
