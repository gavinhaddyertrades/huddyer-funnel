"use client";

const CIRCLE_LINK = "https://huddyertrades.circle.so/join?invitation_token=f2cb778e2f7b9acba1b990d08d137c59a96c82bf-95955f16-1b17-4f79-83b7-9a9c32eede5e";

export default function BlueprintThankYouPage() {
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
        YOU HAVE THE <span style={{ color: "#D4AF37" }}>BLUEPRINT.</span>
      </h1>

      {/* Mockup */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/blueprint-mockup.png" alt="The Market Blueprint" style={{ width: "100%", maxWidth: 480, display: "block", marginBottom: 36 }} />

      <p style={{
        fontFamily: "var(--font-body)",
        fontSize: 16,
        color: "#a89880",
        textAlign: "center",
        lineHeight: 1.7,
        maxWidth: 440,
        marginBottom: 40,
      }}>
        One last step — claim your access to the community below.
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
        Claim Your Access
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", textAlign: "center" }}>
        Opens The Market Blueprint on Circle
      </p>

    </div>
  );
}
