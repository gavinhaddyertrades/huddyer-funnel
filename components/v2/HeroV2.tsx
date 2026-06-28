"use client";

import { useEffect } from "react";

const TESTIMONIAL_IMAGES = [
  "IMG_3080","IMG_3081","IMG_3082","IMG_3083","IMG_3084","IMG_3085",
  "IMG_3086","IMG_3087","IMG_3088","IMG_3089","IMG_3090","IMG_3091",
  "IMG_3092","IMG_3093","IMG_3094","IMG_3095","IMG_3096",
];

const FEATURE_CARDS = [
  {
    img: "/daily-live-trading.png",
    title: "Daily Live Trading",
    body: "Watch Hudson trade live every single day at 9:30am EST. See his setups form, his entries, his exits, and his risk management in real time as it happens.",
  },
  {
    img: "/private-community.png",
    title: "Private Community",
    body: "Connect with other serious traders, share wins, ask questions, and stay accountable inside an active community of traders following the same system.",
  },
  {
    img: "/session-recordings.png",
    title: "Session Recordings",
    body: "Miss a session? Every live trading session is recorded and available inside the community so you never fall behind.",
  },
];

const Logo = () => (
  /* eslint-disable-next-line @next/next/no-img-element */
  <img src="/logo.png" alt="HuddyerTrades Elite" style={{ height: 44, width: "auto" }} />
);

export default function HeroV2() {
  useEffect(() => {
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "ViewContent");
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ backgroundColor: "#1a1810", minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
        <div style={{ maxWidth: 820, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>

          {/* Logo */}
          <Logo />

          {/* Headline */}
          <h1
            className="font-display leading-none text-center"
            style={{ fontSize: "clamp(36px, 6.5vw, 68px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
          >
            Trade Live With Hudson{" "}
            <span className="gold-text-gradient">Every Single Day.</span>
          </h1>

          {/* Descriptor — push info to top per funnel best practices */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(15px, 2vw, 18px)", color: "#a89880", textAlign: "center", lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
            Watch Hudson&apos;s screen. See every setup, every entry, every exit — live in the markets every morning at 9:30am EST.
          </p>

          {/* Hero image */}
          <div style={{ width: "100%", borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/trading-room-2.png" alt="The Trading Room — live with Hudson" style={{ width: "100%", display: "block" }} />
          </div>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <a
              href="/checkout"
              className="btn-gold"
              style={{ fontSize: 16, padding: "15px 40px" }}
              onClick={() => {
                (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("trackCustom", "GetAccessClicked");
              }}
            >
              Join Now
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#555", textAlign: "center", margin: 0 }}>
              Starting at $29.99/mo · If it&apos;s not for you in 30 days, email me — full refund.
            </p>
          </div>

        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section style={{ backgroundColor: "#1a1810", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", textAlign: "center", marginBottom: 12 }}>
            What You Get
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", color: "#F2EDE6", textAlign: "center", letterSpacing: "0.02em", lineHeight: 1.1, marginBottom: 48 }}>
            Everything Inside the <span className="gold-text-gradient">Trading Room</span>
          </h2>
          <div className="features-grid">
            {FEATURE_CARDS.map(({ img, title, body }) => (
              <div key={title} className="feature-card" style={{ backgroundColor: "#111008", border: "1px solid rgba(201,168,76,0.18)", borderRadius: 16, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={title} className="feature-card-img" />
                <div className="feature-card-body">
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#F2EDE6", letterSpacing: "0.02em", marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#999", lineHeight: 1.75, margin: 0 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDENT RESULTS ── */}
      <section style={{ backgroundColor: "#1a1810", padding: "80px 20px 40px" }} className="testimonials-section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", textAlign: "center", marginBottom: 12 }}>
            Student Results
          </p>
          <h2
            className="students-say-heading"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 72px)", color: "#F2EDE6", textAlign: "center", letterSpacing: "0.02em", lineHeight: 1, marginBottom: 56 }}
          >
            WHAT MY <span className="gold-text-gradient">STUDENTS SAY</span>
          </h2>
          <div className="masonry-grid">
            {TESTIMONIAL_IMAGES.map((name) => (
              <div
                key={name}
                className={`masonry-item${name === "IMG_3085" ? " hide-mobile" : ""}`}
                style={{ breakInside: "avoid", marginBottom: 16, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "#1c1d22" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/testimonials/${name}.jpg`} alt="Student result" style={{ width: "100%", display: "block" }} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <section style={{ backgroundColor: "#1a1810", padding: "48px 20px 64px", display: "flex", justifyContent: "center" }}>
        <Logo />
      </section>
    </>
  );
}
