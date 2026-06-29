"use client";

import Script from "next/script";

const WISTIA_ID = "rjt17jvezs";
const TYPEFORM_LINK = "https://form.typeform.com/to/AH6Qxmyu?utm_source=xxxxx&utm_medium=xxxxx&utm_campaign=xxxxx#first_name=xxxxx&email=xxxxx&phone_number=xxxxx&last_name=xxxxx";

export default function ApplyPage() {
  return (
    <>
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
      <Script src={`https://fast.wistia.com/embed/${WISTIA_ID}.js`} strategy="afterInteractive" type="module" />

      <style>{`
        wistia-player[media-id='${WISTIA_ID}']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${WISTIA_ID}/swatch');
          display: block;
          filter: blur(5px);
          padding-top: 56.25%;
        }
      `}</style>

      <div style={{ backgroundColor: "#1a1810", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "15px 20px 72px" }}>

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo4.png" alt="HuddyerTrades Elite" style={{ height: 72, width: "auto", marginBottom: 12 }} />

        {/* Headline */}
        <div style={{ textAlign: "center", maxWidth: 760, marginBottom: 36 }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 6.5vw, 80px)",
            color: "#F2EDE6",
            letterSpacing: "0.02em",
            lineHeight: 0.95,
            marginBottom: 18,
          }}>
            WATCH THIS BEFORE{" "}
            <span className="gold-text-gradient">YOU APPLY.</span>
          </h1>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            color: "#a89880",
            lineHeight: 1.6,
            maxWidth: 520,
            margin: "0 auto",
          }}>
            Hudson walks through exactly how the program works, what he looks for, and what it takes to get access.
          </p>
        </div>

        {/* VSL */}
        <div style={{
          width: "100%",
          maxWidth: 780,
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: 14,
          padding: 5,
          marginBottom: 40,
        }}>
          <div
            style={{ borderRadius: 10, overflow: "hidden" }}
            dangerouslySetInnerHTML={{
              __html: `<wistia-player media-id="${WISTIA_ID}" aspect="1.7777777777777777"></wistia-player>`,
            }}
          />
        </div>

        {/* CTA */}
        <a
          href={TYPEFORM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            backgroundColor: "#D4AF37",
            color: "#0A0A0A",
            fontFamily: "var(--font-body)",
            fontWeight: 800,
            fontSize: 17,
            padding: "20px 48px",
            borderRadius: 12,
            textDecoration: "none",
            marginBottom: 14,
            width: "100%",
            maxWidth: 460,
          }}
        >
          Apply to Work With Hudson
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#555", textAlign: "center" }}>
          Limited spots available — application takes 2 minutes
        </p>

      </div>
    </>
  );
}
