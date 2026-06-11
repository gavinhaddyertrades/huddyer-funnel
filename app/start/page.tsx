"use client";

import { useEffect, useState } from "react";
import { useUTMUrl } from "@/hooks/useUTMUrl";

const WHOP_URL = "https://whop.com/huddyertrades-coaching-ea05/huddyer-trades-community/";

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
    ? `Hey ${firstName}, join traders who skip the guesswork and watch a funded futures trader execute in real time — 9:30 AM EST, every single day.`
    : `Join traders who skip the guesswork and watch a funded futures trader execute in real time — 9:30 AM EST, every single day.`;

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
            Live Trading Community · $79/mo
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
            <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: "#888" }}>
              What You Get
            </p>
            <h2
              className="font-display leading-none"
              style={{ fontSize: "clamp(30px, 5vw, 56px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
            >
              NO RECORDINGS.{" "}
              <span className="gold-text-gradient">NO THEORY.</span>
            </h2>
          </div>

          <div
            className="rounded-2xl p-8 md:p-10"
            style={{ border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.04)" }}
          >
            <div className="flex items-start gap-5">
              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1"
                style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" stroke="#C9A84C" strokeWidth="1.2" />
                  <path d="M7 9l2 2 3-3" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p
                className="font-body leading-relaxed"
                style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#C0BAB0" }}
              >
                Live trading sessions every morning at 9:30 EST — watch every entry, exit, and decision in real time. No recordings. No theory. Just live execution.
              </p>
            </div>
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
      <section style={{ backgroundColor: "#0A0A0A", padding: "72px 20px" }}>
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
          <p className="font-body text-xs uppercase tracking-widest" style={{ color: "#888" }}>
            Student Result
          </p>
          <div
            className="w-full rounded-2xl p-8 md:p-10 text-left"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#111111" }}
          >
            <blockquote
              className="font-body leading-relaxed mb-6"
              style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#D4C9B8", fontStyle: "italic" }}
            >
              &ldquo;I had been trading for two years and spinning my wheels. One month inside this program and I had my first funded payout. The structure changed everything.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-display text-sm"
                style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C" }}
              >
                C
              </div>
              <div>
                <p className="font-display text-sm" style={{ color: "#F2EDE6", letterSpacing: "0.06em" }}>CARMINE</p>
                <p className="font-body text-xs" style={{ color: "#C9A84C" }}>First funded payout within one month</p>
              </div>
            </div>
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
            Join the community and trade alongside Hudson every morning. $79/month. Cancel anytime.
          </p>
          <CTAButton url={ctaUrl} onClick={handleCTAClick} />
          <p className="font-body text-xs" style={{ color: "#555" }}>Cancel anytime.</p>
        </div>
      </section>

    </main>
  );
}
