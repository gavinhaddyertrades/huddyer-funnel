"use client";

import { useEffect, useState } from "react";
import { useUTMUrl } from "@/hooks/useUTMUrl";

const WHOP_URL = "https://whop.com/checkout/5RtaDGGnpBcp80pbj-pfYO-t6Bo-Q5fs-MC5aa34V3ksY/";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C" />
        <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37" />
        <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C" />
        <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37" />
      </svg>
      <span className="font-display text-base" style={{ color: "#F2EDE6", letterSpacing: "0.12em" }}>
        HUDDYERTRADES ELITE
      </span>
    </div>
  );
}

function CTAButton({ url, onClick }: { url: string; onClick: () => void }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-gold"
      style={{ fontSize: "16px", padding: "16px 40px" }}
      onClick={onClick}
    >
      Get Access Now
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

export default function StartPage() {
  const [firstName, setFirstName] = useState("");
  const ctaUrl = useUTMUrl(WHOP_URL);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("first_name") || params.get("fname") || params.get("name") || "";
    if (name) setFirstName(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());

    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "ViewContent", {
      content_name: "Community Landing Page",
    });
  }, []);

  function handleCTAClick() {
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("trackCustom", "CommunityCheckoutClicked");
  }

  const subheadline = firstName
    ? `Hey ${firstName}, join traders who skip the guesswork and watch a funded futures trader execute in real time at 9:30 AM EST, every single day.`
    : `Join traders who skip the guesswork and watch a funded futures trader execute in real time at 9:30 AM EST, every single day.`;

  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>

      {/* Top bar */}
      <div
        className="flex items-center justify-center px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Logo />
      </div>

      {/* ── Hero ── */}
      <div className="max-w-3xl mx-auto px-5 pt-16 pb-16 flex flex-col items-center text-center gap-6">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{ border: "1px solid rgba(201,168,76,0.35)", background: "rgba(201,168,76,0.08)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C", boxShadow: "0 0 6px #C9A84C" }} />
          <span className="font-body text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
            Live Trading Community
          </span>
        </div>

        <h1
          className="font-display leading-none"
          style={{ fontSize: "clamp(38px, 7vw, 80px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          Trade Live With Me.{" "}
          <span className="gold-text-gradient">Every Morning.</span>
        </h1>

        <p
          className="font-body leading-relaxed"
          style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "#999", maxWidth: 560 }}
        >
          {subheadline}
        </p>

        <CTAButton url={ctaUrl} onClick={handleCTAClick} />

        <p className="font-body text-xs" style={{ color: "#555" }}>Cancel anytime.</p>
      </div>

      {/* ── What You Get ── */}
      <section style={{ backgroundColor: "#111111", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "72px 20px" }}>
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          <div className="text-center">
            <p className="font-body text-xs uppercase tracking-widest" style={{ color: "#888" }}>
              What You Get
            </p>
          </div>

          {[
            { label: "Real-time execution", body: "Every trade Hudson takes — live, in front of you. You see the setup, the entry, the management, the exit." },
            { label: "Daily presence", body: "9:30 AM EST, every market morning. Not a weekly webinar. Not a monthly check-in. Every. Single. Day." },
            { label: "Community of serious traders", body: "Surround yourself with other traders who are showing up, putting in the work, and holding each other accountable." },
          ].map((item) => (
            <div
              key={item.label}
              className="flex gap-5 py-6"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="shrink-0 w-1 rounded-full self-stretch"
                style={{ background: "linear-gradient(180deg, #C9A84C, #D4AF37)" }}
              />
              <div className="flex flex-col gap-1.5">
                <h3
                  className="font-display"
                  style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "#F2EDE6", letterSpacing: "0.04em" }}
                >
                  {item.label.toUpperCase()}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#777", maxWidth: 520 }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section style={{ backgroundColor: "#0A0A0A", padding: "72px 20px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", textAlign: "center", marginBottom: 12 }}>
            Student Results
          </p>
          <h2
            className="students-say-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 72px)",
              color: "#F2EDE6",
              textAlign: "center",
              letterSpacing: "0.02em",
              lineHeight: 1,
              marginBottom: 56,
            }}
          >
            WHAT MY{" "}
            <span className="gold-text-gradient">STUDENTS SAY</span>
          </h2>
          <div className="masonry-grid">
            {[
              "IMG_3080","IMG_3081","IMG_3082","IMG_3083","IMG_3084","IMG_3085",
              "IMG_3086","IMG_3087","IMG_3088","IMG_3089","IMG_3090","IMG_3091",
              "IMG_3092","IMG_3093","IMG_3094","IMG_3095","IMG_3096",
            ].map((name) => (
              <div
                key={name}
                className={`masonry-item${name === "IMG_3085" ? " hide-mobile" : ""}`}
                style={{
                  breakInside: "avoid",
                  marginBottom: 16,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backgroundColor: "#1c1d22",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/testimonials/${name}.jpg`}
                  alt="Student result"
                  style={{ width: "100%", display: "block" }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Authority ── */}
      <section style={{ backgroundColor: "#111111", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "72px 20px" }}>
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
          <p className="font-body text-xs uppercase tracking-widest" style={{ color: "#888" }}>
            Who You&apos;re Trading With
          </p>
          <h2
            className="font-display leading-none"
            style={{ fontSize: "clamp(28px, 5vw, 52px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
          >
            HUDSON IS A{" "}
            <span className="gold-text-gradient">FUNDED TRADER.</span>
          </h2>
          <p
            className="font-body leading-relaxed"
            style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#888", maxWidth: 520 }}
          >
            Hudson doesn&apos;t teach theory. He trades live, in front of his community, every morning. You&apos;re not watching a course or following a signal service — you&apos;re watching a real funded futures trader make real decisions in real markets, in real time. The only way to learn execution is to see it executed.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ backgroundColor: "#0A0A0A", padding: "80px 20px 100px" }}>
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
          <h2
            className="font-display leading-none gold-text-gradient"
            style={{ fontSize: "clamp(36px, 7vw, 80px)", letterSpacing: "0.02em", lineHeight: 1 }}
          >
            READY TO TRADE LIVE?
          </h2>
          <p
            className="font-body leading-relaxed"
            style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#888", maxWidth: 460 }}
          >
            Join the community and trade alongside Hudson every morning. Cancel anytime.
          </p>
          <CTAButton url={ctaUrl} onClick={handleCTAClick} />
          <p className="font-body text-xs" style={{ color: "#555" }}>Cancel anytime.</p>
        </div>
      </section>

    </main>
  );
}
