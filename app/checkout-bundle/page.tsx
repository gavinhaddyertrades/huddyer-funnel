"use client";

import Script from "next/script";

const BULLETS = [
  "Two weekly live coaching calls with Hudson",
  "Bring your own trades and get direct feedback",
  "Know exactly what to fix and why",
  "The fastest way to go from inconsistent to consistently profitable",
];

export default function CheckoutBundlePage() {
  return (
    <>
      <Script src="https://js.whop.com/static/checkout/loader.js" strategy="afterInteractive" />
      <style>{`
        .co-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        @media (max-width: 780px) {
          .co-grid { grid-template-columns: 1fr; padding: 24px 16px; }
        }
      `}</style>

      <div style={{ backgroundColor: "#1a1810", minHeight: "100vh" }}>

        {/* Header */}
        <header style={{
          backgroundColor: "#0f0e09",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#C9A84C" }}>🔒</span>
            <span style={{ color: "#F2EDE6", fontWeight: 700, fontSize: 16, fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
              Secure Checkout
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#4ade80", fontSize: 13, fontFamily: "var(--font-body)" }}>
            <span>🔒</span>
            <span>SSL Secured</span>
          </div>
        </header>

        {/* Two-column grid */}
        <div className="co-grid">

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Order Summary */}
            <div style={{
              backgroundColor: "#111008",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 16,
              padding: 24,
            }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#F2EDE6", marginBottom: 20, letterSpacing: "0.02em" }}>
                Order Summary
              </h2>

              {/* Line item 1 — Trading Room */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 14,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    backgroundColor: "rgba(201,168,76,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#C9A84C", fontSize: 16,
                  }}>⚡</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 600, fontSize: 14 }}>The Trading Room</div>
                    <div style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: 12 }}>Monthly membership</div>
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 600 }}>$29.99/mo</span>
              </div>

              {/* Line item 2 — Inner Circle (added) */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 16,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    backgroundColor: "rgba(74,222,128,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#4ade80", fontSize: 16,
                  }}>✓</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 600, fontSize: 14 }}>Inner Circle</div>
                    <div style={{ fontFamily: "var(--font-body)", color: "#4ade80", fontSize: 12 }}>Added to your order</div>
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 600 }}>$69.01/mo</span>
              </div>

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 700, fontSize: 15 }}>Total Today</span>
                <span style={{ fontFamily: "var(--font-display)", color: "#D4AF37", fontWeight: 700, fontSize: 22 }}>$99.00/mo</span>
              </div>
            </div>

            {/* Bundle Confirmed Box */}
            <div style={{ border: "1.5px solid #4ade80", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ backgroundColor: "#4ade80", padding: "11px 20px", display: "flex", alignItems: "center", gap: 8 }}>
                <span>●</span>
                <span style={{ color: "#0A0A0A", fontWeight: 800, fontSize: 11, letterSpacing: "0.13em", fontFamily: "var(--font-body)" }}>
                  ORDER BUMP INCLUDED
                </span>
              </div>

              <div style={{ backgroundColor: "#0c1a10", padding: 24 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    backgroundColor: "rgba(74,222,128,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#4ade80", fontSize: 16, flexShrink: 0,
                  }}>✓</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                      The Trading Room + Inner Circle has been added!
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", color: "#999", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                      Twice a week Hudson gets on a live call and breaks down your specific trades, your setups, and exactly what to fix.
                    </p>
                  </div>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {BULLETS.map((b) => (
                    <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "var(--font-body)", color: "#c8c2b8", fontSize: 14 }}>
                      <span style={{ color: "#4ade80", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div style={{ borderTop: "1px solid rgba(74,222,128,0.15)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", color: "#c8c2b8", fontSize: 14 }}>Bundle total</span>
                  <span style={{ fontFamily: "var(--font-display)", color: "#4ade80", fontWeight: 700, fontSize: 22 }}>$99.00/mo</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: Whop Embed ── */}
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
              data-whop-checkout-plan-id="plan_lup9qntfwv0jy"
              data-whop-checkout-theme-background-color="#111008"
              data-whop-checkout-theme-accent-color="#D4AF37"
              data-whop-checkout-theme-border-radius="10"
              data-whop-checkout-style-container-padding-x="0"
              data-whop-checkout-style-container-padding-y="0"
            />
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
