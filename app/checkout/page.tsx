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
        @keyframes gold-shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .gold-shimmer-bg {
          background: linear-gradient(90deg, #8B2010 0%, #da4f37 30%, #FF9070 50%, #da4f37 70%, #8B2010 100%);
          background-size: 200% auto;
          animation: gold-shimmer 6s linear infinite;
        }
        .gold-shimmer-border {
          border-radius: 16px;
          overflow: hidden;
          padding: 1.5px;
          background: linear-gradient(90deg, #8B2010 0%, #da4f37 30%, #FF9070 50%, #da4f37 70%, #8B2010 100%);
          background-size: 200% auto;
          animation: gold-shimmer 6s linear infinite;
        }
        .gold-shimmer-border-inner {
          border-radius: 14px;
          overflow: hidden;
        }
        .bump-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(90deg, #8B2010 0%, #da4f37 30%, #FF9070 50%, #da4f37 70%, #8B2010 100%);
          background-size: 200% auto;
          animation: gold-shimmer 6s linear infinite;
          color: #0A0A0A;
          padding: 15px 24px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 15px;
          text-decoration: none;
          width: 100%;
          box-sizing: border-box;
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
          <div className="gold-shimmer-border">
            <div className="gold-shimmer-border-inner">
            <div className="gold-shimmer-bg" style={{ padding: "11px 20px", display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚡</span>
              <span style={{ color: "#0A0A0A", fontWeight: 800, fontSize: 11, letterSpacing: "0.13em", fontFamily: "var(--font-body)" }}>
                SPECIAL ONE-TIME OFFER
              </span>
            </div>

            <div style={{ backgroundColor: "#111008", padding: "16px 20px" }}>
              <p style={{ fontFamily: "var(--font-body)", color: "#c8c2b8", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
                Add live coaching with Hudson twice a week for just $69.99/mo
              </p>
              <Link href="/checkout-bundle" className="bump-btn">
                Yes, Add Live Coaching
              </Link>
            </div>
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
