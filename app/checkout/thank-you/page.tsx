"use client";

import { useEffect } from "react";

const CIRCLE_LINK = "https://huddyertrades.circle.so/join?invitation_token=a3ef0280162ad7f0fbecac34f5a9e005334036ad-e75dd0ab-cd2d-46e4-bbc1-c558ff26bf5a";

export default function CheckoutThankYouPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag!("event", "purchase", {
        event_category: "conversion",
        event_label: "Trading Room Purchase",
        value: 29.99,
        currency: "USD",
      });
    }
  }, []);

  return (
    <div style={{ backgroundColor: "#1a1810", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>

      {/* Logo */}
      <div style={{ marginBottom: 40 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo4.png" alt="HuddyerTrades Elite" style={{ height: 64, width: "auto" }} />
      </div>

      {/* Confirmation badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        backgroundColor: "rgba(74,222,128,0.1)",
        border: "1px solid rgba(74,222,128,0.3)",
        borderRadius: 999, padding: "6px 16px",
        marginBottom: 28,
      }}>
        <span style={{ color: "#4ade80", fontSize: 14 }}>✓</span>
        <span style={{ fontFamily: "var(--font-body)", color: "#4ade80", fontSize: 13, fontWeight: 600 }}>Payment confirmed</span>
      </div>

      {/* Heading */}
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(36px, 6vw, 68px)",
        color: "#F2EDE6",
        letterSpacing: "0.02em",
        lineHeight: 1,
        textAlign: "center",
        marginBottom: 16,
      }}>
        YOU&apos;RE IN THE <span style={{ color: "#D4AF37" }}>TRADING ROOM.</span>
      </h1>

      {/* Mockup */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/new-mockup-2.png" alt="The Trading Room" style={{ width: "100%", maxWidth: 480, display: "block", marginBottom: 36 }} />

      <p style={{
        fontFamily: "var(--font-body)",
        fontSize: 16,
        color: "#a89880",
        textAlign: "center",
        lineHeight: 1.7,
        maxWidth: 440,
        marginBottom: 40,
      }}>
        One last step — click below to claim your access to the community. Hudson goes live every morning at 9:30am EST.
      </p>

      {/* Primary CTA — Circle */}
      <a
        href={CIRCLE_LINK}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          backgroundColor: "#D4AF37",
          color: "#0A0A0A",
          fontFamily: "var(--font-body)",
          fontWeight: 800,
          fontSize: 16,
          padding: "18px 40px",
          borderRadius: 12,
          textDecoration: "none",
          marginBottom: 12,
          width: "100%",
          maxWidth: 460,
        }}
      >
        Claim Your Community Access
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", textAlign: "center" }}>
        Opens The Trading Room on Circle
      </p>

    </div>
  );
}
