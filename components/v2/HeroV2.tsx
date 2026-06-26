"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const WISTIA_ID = "brt54jahpj";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.07)",
        backgroundColor: "#141414",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, padding: "20px 24px",
          background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "#F2EDE6", lineHeight: 1.4 }}>
          {question}
        </span>
        <span style={{ color: "#C9A84C", fontSize: 22, lineHeight: 1, flexShrink: 0, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>
          +
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 24px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.75, color: "#999", margin: "16px 0 0" }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

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
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
      <Script src={`https://fast.wistia.com/embed/${WISTIA_ID}.js`} strategy="afterInteractive" type="module" />
      <Script src="https://js.whop.com/static/checkout/loader.js" strategy="afterInteractive" />

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
            The Trading System That Turns Complete Beginners Into{" "}
            <span className="gold-text-gradient">Profitable Traders.</span>
          </h1>

          {/* Subheadline */}
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

          {/* CTA scrolls to checkout */}
          <button
            className="btn-gold w-full justify-center"
            style={{ fontSize: "16px", padding: "14px 32px", maxWidth: 260 }}
            onClick={() => {
              (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("trackCustom", "GetAccessClicked");
              document.getElementById("whop-checkout")?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            Get Access
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Whop inline checkout */}
          <div
            id="whop-checkout"
            style={{
              width: "100%",
              maxWidth: 480,
              marginTop: 48,
              borderRadius: 20,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 0 60px 20px rgba(201,168,76,0.25), 0 0 120px 40px rgba(201,168,76,0.12)",
            }}
          >
            {/* Glow layer behind the embed */}
            <div
              style={{
                position: "absolute",
                inset: -2,
                borderRadius: 22,
                background: "linear-gradient(135deg, rgba(201,168,76,0.35) 0%, rgba(212,175,55,0.15) 50%, rgba(201,168,76,0.35) 100%)",
                zIndex: 0,
              }}
            />
            <div style={{ position: "relative", zIndex: 1, borderRadius: 20, overflow: "hidden" }}>
              <div
                data-whop-checkout-plan-id="plan_eQo22hOT09YbV"
                data-whop-checkout-theme-background-color="#000000"
                data-whop-checkout-theme-accent-color="#ffffff"
                data-whop-checkout-theme-border-radius="14"
                data-whop-checkout-style-container-padding-x="20"
                data-whop-checkout-style-container-padding-y="28"
                data-whop-checkout-setup-future-usage="off_session"
                data-whop-checkout-collect-phone-numbers="true"
                data-whop-checkout-hide-tos="true"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ backgroundColor: "#1a1810", padding: "80px 20px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", textAlign: "center", marginBottom: 12 }}>
            FAQ
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "#F2EDE6",
              textAlign: "center",
              letterSpacing: "0.02em",
              lineHeight: 1,
              marginBottom: 48,
            }}
          >
            COMMON <span className="gold-text-gradient">QUESTIONS</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                q: "Is this for beginners or experienced traders?",
                a: "This mentorship is built for traders at any level. Whether you're just getting started or already trading and struggling with consistency, Hudson's system gives you a clear path to profitability.",
              },
              {
                q: "What exactly do I get each month?",
                a: "Live trading sessions every morning with Hudson at 9:30am EST, twice a week group coaching calls, and access to his complete video curriculum. Everything you need to trade his system from day one.",
              },
              {
                q: "How is this different from a course?",
                a: "You're not just watching videos. You're trading live with Hudson every single day and getting coached directly. This is active mentorship, not passive content.",
              },
              {
                q: "How long until I see results?",
                a: "Results vary based on your starting point and how consistently you apply the system. Hudson's students have passed prop firm evals and pulled their first payouts within 7 to 30 days of implementing his framework.",
              },
            ].map(({ q, a }) => (
              <FAQItem key={q} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ backgroundColor: "#1a1810", padding: "80px 20px 100px" }} className="testimonials-section">
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

          {/* Logo lockup at bottom of testimonials */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
            {logoMarkup}
          </div>

        </div>
      </section>
    </>
  );
}
