"use client";

import { useRef } from "react";

const CIRCLE_LINK = "https://huddyertrades.circle.so/join?invitation_token=e35400a61fcac7be55746f691e85efafca61209c-172015d8-e65c-42fe-bc98-7c5983ea8a92";
const FORM_ID = "AH6Qxmyu";

export default function CheckoutBundleThankYouPage() {
  const popupRef = useRef<{ open: () => void } | null>(null);

  async function openForm() {
    if (!popupRef.current) {
      const { createPopup } = await import("@typeform/embed");
      popupRef.current = createPopup(FORM_ID, {
        hidden: { utm_source: "bundle-thank-you" },
        opacity: 100,
      });
    }
    popupRef.current.open();
  }

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
        <span style={{ fontFamily: "var(--font-body)", color: "#4ade80", fontSize: 13, fontWeight: 600 }}>Payment confirmed — Elite access unlocked</span>
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
        WELCOME TO THE <span style={{ color: "#D4AF37" }}>ELITE.</span>
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
        One last step — claim your Elite access below. This gives you entry to the exclusive Inner Circle community with Hudson&apos;s live coaching calls.
      </p>

      {/* Primary CTA — Circle Elite */}
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
        Claim Your Elite Access
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", textAlign: "center", marginBottom: 56 }}>
        Opens the Elite Inner Circle on Circle
      </p>

      {/* Divider */}
      <div style={{ width: "100%", maxWidth: 520, height: 1, backgroundColor: "rgba(201,168,76,0.15)", marginBottom: 56 }} />

      {/* Book a call section */}
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 16 }}>
          One more thing
        </p>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 4vw, 38px)",
          color: "#F2EDE6",
          letterSpacing: "0.02em",
          lineHeight: 1.1,
          marginBottom: 16,
        }}>
          Want Hudson to personally review your trading?
        </h2>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 15,
          color: "#a89880",
          lineHeight: 1.75,
          marginBottom: 32,
        }}>
          As an Elite member you get access to Hudson&apos;s live coaching calls — but book a 1-on-1 strategy call now so he can look at your specific setup before your first session.
        </p>

        <div style={{
          backgroundColor: "#111008",
          border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: 16,
          padding: "28px 28px 24px",
          marginBottom: 24,
          textAlign: "left",
        }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", marginBottom: 16 }}>
            On the call you&apos;ll cover
          </p>
          {[
            "Your current trading setup and where it's breaking down",
            "Which of Hudson's setups fit your schedule and risk tolerance",
            "A clear action plan for your first 30 days in the Elite",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
              <span style={{ color: "#D4AF37", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontFamily: "var(--font-body)", color: "#c8c2b8", fontSize: 14, lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>

        <button
          onClick={openForm}
          style={{
            width: "100%",
            backgroundColor: "transparent",
            color: "#D4AF37",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 15,
            padding: "14px 24px",
            borderRadius: 12,
            border: "1px solid rgba(212,175,55,0.4)",
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          Apply for a Free Strategy Call
        </button>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", textAlign: "center" }}>
          Free. No obligation. Takes 2 minutes to apply.
        </p>
      </div>

    </div>
  );
}
