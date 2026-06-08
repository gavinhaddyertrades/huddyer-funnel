"use client";

import { useEffect, useState } from "react";
import ChartBackground from "@/components/v2/ChartBackground";

function YoutubeFacade({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{ aspectRatio: "16 / 9", border: "1px solid rgba(201,168,76,0.25)", background: "#111" }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
          title="Carmine's results"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ border: "none" }}
        />
      ) : (
        <div
          className="absolute inset-0 cursor-pointer group"
          onClick={() => setPlaying(true)}
          role="button"
          aria-label="Play Carmine's testimonial video"
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="Carmine's trading results"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-30" style={{ background: "rgba(0,0,0,0.4)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full transition-transform duration-200 group-hover:scale-110"
              style={{ background: "#C9A84C", boxShadow: "0 4px 30px rgba(201,168,76,0.6)" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 5l10 5-10 5V5z" fill="#0A0A0A" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

export default function FreeThankYouPage() {
  useEffect(() => {
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "Lead");
  }, []);

  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", position: "relative" }}>
      <ChartBackground />

      {/* Top bar */}
      <div
        className="flex items-center justify-center px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Logo />
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-14 pb-20 flex flex-col items-center text-center gap-8">

        {/* Headline */}
        <h1
          className="font-display leading-none"
          style={{ fontSize: "clamp(32px, 6vw, 64px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          CHECK YOUR INBOX —{" "}
          <span className="gold-text-gradient">THE VIDEO IS ON ITS WAY.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="font-body leading-relaxed"
          style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#B0B0B0", maxWidth: 480 }}
        >
          While you wait, here&apos;s what one student did with this exact framework:
        </p>

        {/* Carmine video */}
        <div className="w-full">
          <YoutubeFacade videoId="vxHRcR9xTFQ" />
        </div>

        {/* Quote line */}
        <p
          className="font-body leading-relaxed"
          style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#B0B0B0", maxWidth: 480 }}
        >
          Carmine was funded within one week and got his first payout{" "}
          <span style={{ color: "#D4AF37", fontWeight: 600 }}>ONE month</span>{" "}inside Hudson&apos;s mentorship.
        </p>

      </div>
    </main>
  );
}
