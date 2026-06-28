"use client";

import { useEffect } from "react";

const GOLD = "#D4AF37";
const BG = "#1a1810";
const BG_DARK = "#111008";

const TESTIMONIALS = [
  "IMG_3080","IMG_3081","IMG_3082","IMG_3083","IMG_3084","IMG_3085",
  "IMG_3086","IMG_3087","IMG_3088","IMG_3089","IMG_3090","IMG_3091",
  "IMG_3092","IMG_3093","IMG_3094","IMG_3095","IMG_3096","IMG_3080",
];

function trackClick() {
  (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("trackCustom", "GetAccessClicked");
}

function TrustBadges({ onLight = false }: { onLight?: boolean }) {
  const textColor = onLight ? "#666" : "#888";
  const iconColor = onLight ? "#444" : "#aaa";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
      {[
        { icon: "🔒", label: "Secure Payment" },
        { icon: "💰", label: "30-Day Refund" },
        { icon: "⚡", label: "Instant Access" },
      ].map(({ icon, label }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: iconColor }}>{icon}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: textColor, letterSpacing: "0.04em" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function CTAButton({ label, subtitle, dark = false, fullWidth = false }: { label: string; subtitle?: string; dark?: boolean; fullWidth?: boolean }) {
  return (
    <a
      href="/checkout"
      onClick={trackClick}
      style={{
        display: "inline-flex",
        flexDirection: subtitle ? "column" : "row",
        alignItems: "center", justifyContent: "center",
        gap: subtitle ? 4 : 8,
        width: fullWidth ? "100%" : undefined,
        background: dark ? "#0A0A0A" : `linear-gradient(135deg, #C9A84C 0%, ${GOLD} 50%, #C9A84C 100%)`,
        color: dark ? GOLD : "#0A0A0A",
        fontFamily: "var(--font-body)", fontWeight: 800,
        fontSize: subtitle ? 17 : 15,
        padding: subtitle ? "20px 28px" : "16px 32px",
        borderRadius: 10, textDecoration: "none",
        letterSpacing: "0.06em", textTransform: "uppercase",
        boxShadow: dark ? "none" : "0 6px 24px rgba(212,175,55,0.35)",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {label}
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {subtitle && (
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.1em", opacity: 0.75, textTransform: "uppercase" }}>
          {subtitle}
        </span>
      )}
    </a>
  );
}

function GoldCheck() {
  return (
    <span style={{ color: GOLD, fontSize: 18, flexShrink: 0, fontWeight: 700, marginTop: 1, lineHeight: 1 }}>✓</span>
  );
}

const Logo = () => (
  /* eslint-disable-next-line @next/next/no-img-element */
  <img src="/logo4.png" alt="HuddyerTrades Elite" style={{ height: 56, width: "auto" }} />
);

export default function HeroV2() {
  useEffect(() => {
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "ViewContent");
  }, []);

  return (
    <>
      <style>{`
        .offer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .testimonials-3col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 860px) {
          .offer-grid { grid-template-columns: 1fr; }
          .offer-right { order: -1; }
          .offer-left { display: none; }
          .why-grid { grid-template-columns: 1fr; }
          .testimonials-3col { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .testimonials-3col { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .hero-section { padding: 32px 16px 48px !important; }
        }
      `}</style>

      {/* ══════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════ */}
      <section className="hero-section" style={{ backgroundColor: BG, padding: "52px 20px 64px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>

          <div style={{ marginBottom: 32 }}><Logo /></div>

          {/* Label */}
          <div style={{
            border: `1px solid rgba(212,175,55,0.4)`, borderRadius: 999,
            padding: "4px 15px", marginBottom: 20,
            backgroundColor: "rgba(212,175,55,0.06)",
          }}>
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12, color: GOLD, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              The Trading Room
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-center"
            style={{ fontSize: "clamp(34px, 6vw, 68px)", color: "#F2EDE6", lineHeight: 0.95, letterSpacing: "0.02em", marginBottom: 11 }}
          >
            WATCH A FUNDED TRADER HIT THE MARKETS{" "}
            <span style={{ color: GOLD }}>LIVE. EVERY SINGLE DAY.</span>
          </h1>

          {/* Subheadline */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 2vw, 19px)", color: "#b0a898", textAlign: "center", lineHeight: 1, maxWidth: 640, marginBottom: 36 }}>
            Join Hudson live every morning and follow the exact system his students use to pass prop firm evals and pull consistent payouts.
          </p>

          {/* Hero mockup image */}
          <div style={{ width: "100%", marginBottom: 36 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/new-mockup-2.png" alt="The Trading Room Live Dashboard" style={{ width: "100%", display: "block" }} />
          </div>

          {/* CTA + guarantee */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
            <CTAButton label="JOIN THE TRADING ROOM" fullWidth />
            {/* Guarantee box */}
            <div style={{
              display: "flex", alignItems: "center", gap: 14,
              border: "1.5px dashed rgba(212,175,55,0.4)",
              borderRadius: 14, padding: "14px 20px", width: "100%",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/money-back.png" alt="30-Day Money Back Guarantee" style={{ width: 64, height: 64, objectFit: "contain", flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, color: "#F2EDE6", margin: 0, marginBottom: 3, letterSpacing: "0.04em" }}>
                  30-DAY MONEY BACK GUARANTEE
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#888", margin: 0, lineHeight: 1.5 }}>
                  Not happy within 30 days? Email us for a full refund, no questions asked.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 2 — OFFER (two column)
      ══════════════════════════════════ */}
      <section style={{ backgroundColor: "#f4f1eb" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="offer-grid">

            {/* LEFT: image */}
            <div className="offer-left" style={{ padding: "60px 44px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ece9e1" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/new-mockup-2.png"
                alt="The Trading Room"
                style={{ width: "100%", maxWidth: 460, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", display: "block" }}
              />
            </div>

            {/* RIGHT: offer details */}
            <div className="offer-right" style={{ padding: "60px 48px", backgroundColor: "#f4f1eb", display: "flex", flexDirection: "column", gap: 0 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3vw, 40px)", color: "#111", letterSpacing: "0.02em", lineHeight: 1.05, marginBottom: 8 }}>
                JOIN THE TRADING ROOM TODAY
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, color: GOLD, marginBottom: 24, letterSpacing: "0.02em" }}>
                Founding Member Pricing Available NOW
              </p>

              {/* Pricing */}
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 20, color: "#aaa", textDecoration: "line-through" }}>$97/month</span>
              </div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 58px)", color: GOLD, lineHeight: 1, letterSpacing: "0.02em", marginBottom: 10 }}>
                Only $29.99/month
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#555", marginBottom: 28, lineHeight: 1.6 }}>
                Get instant access to live trading with Hudson every single day
              </p>

              {/* Bullets */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                {[
                  "Daily Live Trading Sessions with Hudson",
                  "Watch every setup, entry, and exit in real time",
                  "Private Trading Community with active traders",
                  "Session Recordings so you never miss a session",
                ].map((text) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <GoldCheck />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#222", lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <CTAButton label="Join the Trading Room" fullWidth />
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", textAlign: "center", margin: 0 }}>
                  30-Day Money Back Guarantee. No contracts. Cancel anytime.
                </p>
                <TrustBadges onLight />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 3 — WHY IT WORKS
      ══════════════════════════════════ */}
      <section style={{ backgroundColor: BG_DARK, padding: "88px 20px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 52px)", color: "#F2EDE6", textAlign: "center", letterSpacing: "0.02em", lineHeight: 1.05, marginBottom: 56 }}>
            Why Joining the Trading Room Gets You Results Faster
          </h2>
          <div className="why-grid">
            {[
              {
                title: "Build a Daily Trading Habit",
                desc: "Most traders fail because they never develop consistency. Showing up live every day with Hudson builds the discipline that creates profitable traders.",
              },
              {
                title: "Stop Guessing. Start Seeing.",
                desc: "Watching Hudson trade live every morning shows you exactly how the system works in real market conditions. Not theory. Real trades, real decisions, real results.",
              },
              {
                title: "Learn by Watching Someone Who Actually Does It",
                desc: "Hudson trades live every single day. You watch his screen, see his thought process, and follow every move as it happens in the live market.",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                style={{ backgroundColor: BG, border: `1px solid rgba(212,175,55,0.18)`, borderRadius: 16, padding: "36px 28px" }}
              >
                <div style={{ width: 36, height: 3, backgroundColor: GOLD, borderRadius: 2, marginBottom: 20 }} />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#F2EDE6", letterSpacing: "0.02em", marginBottom: 12, lineHeight: 1.2 }}>
                  {title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#888", lineHeight: 1.8, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 4 — WHAT'S INSIDE
      ══════════════════════════════════ */}
      <section style={{ backgroundColor: BG, padding: "88px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>

          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.5vw, 28px)", color: GOLD, letterSpacing: "0.08em", textAlign: "center", marginBottom: 4 }}>
            What&apos;s Inside
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 6.5vw, 72px)", color: "#F2EDE6", letterSpacing: "0.02em", lineHeight: 0.95, textAlign: "center", marginBottom: 44 }}>
            The Trading Room?
          </h2>

          {/* Large centered image */}
          <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.5)", marginBottom: 48 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/new-mockup-2.png" alt="Inside the Trading Room" style={{ width: "100%", display: "block" }} />
          </div>

          {/* Bullets */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { bold: "Daily Live Trading Sessions", desc: "so you can watch Hudson trade the live market every single morning and see every setup, entry, and exit as it happens" },
              { bold: "Session Recordings", desc: "so you never miss a session and can watch back any live trading day at any time" },
              { bold: "Private Community", desc: "so you can connect with serious traders, share wins, ask questions, and stay accountable every single day" },
              { bold: "Real Market Experience", desc: "so you stop learning from theory and start watching a funded trader work the actual live market every morning" },
            ].map(({ bold, desc }) => (
              <div key={bold} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <GoldCheck />
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#b0a898", lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: "#F2EDE6", fontWeight: 700 }}>{bold}</strong> {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 5 — SOCIAL PROOF
      ══════════════════════════════════ */}
      <section style={{ backgroundColor: BG_DARK, padding: "88px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 64px)", color: "#F2EDE6", textAlign: "center", letterSpacing: "0.02em", lineHeight: 1, marginBottom: 56 }}>
            What Traders Are Saying
          </h2>
          <div className="testimonials-3col">
            {TESTIMONIALS.map((name) => (
              <div
                key={name}
                style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "#1c1d22" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/testimonials/${name}.jpg`} alt="Trader result" style={{ width: "100%", display: "block" }} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 6 — FINAL CTA BANNER
      ══════════════════════════════════ */}
      <section style={{ backgroundColor: GOLD, padding: "80px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5.5vw, 68px)", color: "#0A0A0A", textAlign: "center", letterSpacing: "0.02em", lineHeight: 0.95, marginBottom: 14 }}>
            JOIN THE TRADING ROOM FOR ONLY $29.99/MONTH
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, color: "#333", letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center", marginBottom: 36 }}>
            INSTANT ACCESS. NO CONTRACTS. CANCEL ANYTIME.
          </p>
          <CTAButton label="JOIN NOW" dark />
        </div>
      </section>
    </>
  );
}
