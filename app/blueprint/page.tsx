"use client";

import Script from "next/script";

const INCLUDES = [
  { title: "40+ Video Modules", desc: "Hudson's complete trading system broken down step-by-step — from market structure to advanced execution." },
  { title: "The Blueprint Workbook", desc: "Follow-along workbook covering every module so you can apply what you learn immediately." },
  { title: "Market Structure Mastery", desc: "Learn to read BOS, CHoCH, liquidity zones, and entries the way Hudson trades them live every day." },
  { title: "Risk Management Framework", desc: "Position sizing, drawdown control, and the consistency rules Hudson uses on funded accounts." },
  { title: "Trade Examples & Setups", desc: "Real setups with annotated charts — see exactly how Hudson identifies and executes his trades." },
];

export default function BlueprintPage() {
  return (
    <>
      <Script src="https://js.whop.com/static/checkout/loader.js" strategy="afterInteractive" />
      <style>{`
        .bp-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 32px;
          align-items: start;
        }
        .co-header { display: flex; }
        .co-mobile-hero { display: none; }
        @media (max-width: 780px) {
          .bp-layout { grid-template-columns: 1fr; padding: 16px 16px; gap: 24px; }
          .bp-right { display: none; }
          .co-header { display: none; }
          .co-mobile-hero { display: block; text-align: center; padding: 24px 20px 0; }
        }
      `}</style>

      <div style={{ backgroundColor: "#1a1810", minHeight: "100vh" }}>

        {/* Mobile hero — hidden on desktop */}
        <div className="co-mobile-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueprint-mockup.png" alt="The Blueprint" style={{ width: "100%", maxWidth: 360, display: "block", margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "#F2EDE6", letterSpacing: "0.02em", lineHeight: 1, marginBottom: 10 }}>
            The Market Blueprint
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#a89880", lineHeight: 1.6, maxWidth: 320, margin: "0 auto 20px" }}>
            Complete your order below to get instant access
          </p>
          <div style={{ textAlign: "left", maxWidth: 340, margin: "0 auto 8px", display: "flex", flexDirection: "column", gap: 14 }}>
            {INCLUDES.map((item) => (
              <div key={item.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                  backgroundColor: "rgba(212,175,55,0.15)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#D4AF37", fontSize: 11, fontWeight: 700,
                }}>✓</div>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: 13, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Header — hidden on mobile */}
        <header className="co-header" style={{
          backgroundColor: "#0f0e09",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
          padding: "16px 32px",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo4.png" alt="HuddyerTrades Elite" style={{ height: 48, width: "auto" }} />
        </header>

        <div className="bp-layout">

          {/* LEFT — Whop Checkout */}
          <div style={{
            backgroundColor: "#111008",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 16,
            padding: 28,
          }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#F2EDE6", marginBottom: 4, letterSpacing: "0.02em" }}>
              Complete Your Order
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: 13, marginBottom: 24 }}>
              Enter your details below to get instant access
            </p>
            <div
              data-whop-checkout-plan-id="plan_Z4SVGh6whbYCQ"
              data-whop-checkout-theme-background-color="#111008"
              data-whop-checkout-theme-accent-color="#D4AF37"
              data-whop-checkout-theme-border-radius="10"
              data-whop-checkout-style-container-padding-x="0"
              data-whop-checkout-style-container-padding-y="0"
            />
          </div>

          {/* RIGHT — Product info */}
          <div className="bp-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/blueprint-mockup.png" alt="The Blueprint" style={{ width: "100%", display: "block", marginBottom: 28, borderRadius: 12 }} />

            <p style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.18em", color: "#D4AF37", marginBottom: 8 }}>
              HERE'S EVERYTHING YOU GET
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 2.5vw, 36px)", color: "#F2EDE6", letterSpacing: "0.02em", lineHeight: 1.05, marginBottom: 24 }}>
              The Blueprint — Hudson's Complete Trading System
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {INCLUDES.map((item) => (
                <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                    backgroundColor: "rgba(212,175,55,0.15)",
                    border: "1px solid rgba(212,175,55,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#D4AF37", fontSize: 12, fontWeight: 700,
                  }}>✓</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer style={{
          textAlign: "center",
          padding: "24px 20px 56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          fontFamily: "var(--font-body)",
          color: "#555",
          fontSize: 13,
          flexWrap: "wrap",
        }}>
          <span>🔒 Secure Payment</span>
          <span>•</span>
          <span>⚡ Powered by Whop</span>
          <span>•</span>
          <span>✓ Instant Access</span>
        </footer>

      </div>
    </>
  );
}
