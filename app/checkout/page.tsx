"use client";

import Script from "next/script";
import Link from "next/link";

const BULLETS = [
  "Two weekly live coaching calls with Hudson",
  "Bring your own trades and get direct feedback",
  "Know exactly what to fix and why",
  "The fastest way to go from inconsistent to consistently profitable",
];

export default function CheckoutPage() {
  return (
    <>
      <Script src="https://js.whop.com/static/checkout/loader.js" strategy="afterInteractive" />
      <style>{`
        .co-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 560px;
          margin: 0 auto;
          padding: 32px 24px;
        }
        .co-header { display: flex; }
        .co-mobile-hero { display: none; }
        @media (max-width: 780px) {
          .co-grid { padding: 16px 16px; }
          .co-header { display: none; }
          .co-mobile-hero { display: block; text-align: center; padding: 24px 20px 0; }
        }
        .bump-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #D4AF37;
          color: #0A0A0A;
          padding: 15px 24px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 15px;
          text-decoration: none;
          width: 100%;
          box-sizing: border-box;
          transition: opacity 0.15s;
          font-family: var(--font-body);
        }
        .bump-btn:hover { opacity: 0.88; }
      `}</style>

      <div style={{ backgroundColor: "#1a1810", minHeight: "100vh" }}>

        {/* Mobile hero — hidden on desktop */}
        <div className="co-mobile-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/new-mockup-2.png" alt="The Trading Room" style={{ width: "100%", maxWidth: 360, display: "block", margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "#F2EDE6", letterSpacing: "0.02em", lineHeight: 1, marginBottom: 10 }}>
            The Trading Room
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#a89880", lineHeight: 1.6, maxWidth: 320, margin: "0 auto 8px" }}>
            Complete your order below to secure this special discount
          </p>
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

        {/* Two-column grid */}
        <div className="co-grid">

          {/* Order Bump */}
          <div style={{ border: "1.5px solid #D4AF37", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ backgroundColor: "#D4AF37", padding: "11px 20px", display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚡</span>
              <span style={{ color: "#0A0A0A", fontWeight: 800, fontSize: 11, letterSpacing: "0.13em", fontFamily: "var(--font-body)" }}>
                SPECIAL ONE-TIME OFFER
              </span>
            </div>

            <div style={{ backgroundColor: "#111008", padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "#F5A623", fontSize: 15 }}>★</span>
                  ))}
                </div>
                <span style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 700, fontSize: 14 }}>4.9</span>
                <span style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: 13 }}>(117 reviews)</span>
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
                  color: "#4ade80",
                  backgroundColor: "rgba(74,222,128,0.12)",
                  border: "1px solid rgba(74,222,128,0.3)",
                  borderRadius: 999, padding: "3px 10px",
                }}>87% of buyers add this</span>
              </div>

              <h3 style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 700, fontSize: 16, lineHeight: 1.55, marginBottom: 12 }}>
                Already joining the Trading Room? Add live coaching with Hudson twice a week for just $47 more.
              </h3>
              <p style={{ fontFamily: "var(--font-body)", color: "#999", fontSize: 14, lineHeight: 1.75, marginBottom: 18 }}>
                Twice a week Hudson gets on a live call and breaks down your specific trades, your setups, and exactly what to fix.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                {BULLETS.map((b) => (
                  <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "var(--font-body)", color: "#c8c2b8", fontSize: 14 }}>
                    <span style={{ color: "#C9A84C", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", marginBottom: 6 }}>
                  Add to Order
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", color: "#F2EDE6", fontWeight: 600, fontSize: 14 }}>
                    The Trading Room + Inner Circle
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-body)", color: "#666", fontSize: 12, textDecoration: "line-through", marginBottom: 2 }}>$179.98/mo</div>
                    <div style={{ fontFamily: "var(--font-display)", color: "#D4AF37", fontWeight: 700, fontSize: 20 }}>$99/mo</div>
                  </div>
                </div>
              </div>

              <Link href="/checkout-bundle" className="bump-btn">
                ⚡ Yes, Add This to My Order
              </Link>
              <p style={{ fontFamily: "var(--font-body)", textAlign: "center", fontSize: 12, color: "#555", marginTop: 8 }}>
                You will be charged $99.00/mo total
              </p>
            </div>
          </div>

          {/* Whop Embed */}
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
              data-whop-checkout-plan-id="plan_PqEIpMY8QVZhi"
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
